"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Select,
  Table,
  Tabs,
  TabsContent,
  Text,
  Upload,
} from "@hdfclife-insurance/one-x-ui";
import api from "../services/api";
import uploadApi from "../services/uploadapi";

interface Partner {
  id: string;
  partnerName: string;
}

interface LoaderConfig {
  id?: string;
  createdAt?: string;
  loaderId?: string;
  templateName?: string;
  loaderType?: string;
  uploadedBy?: string;
  downloadUrl?: string;
}

export default function DashboardTable() {
  // Partner state
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [partnerLoadError, setPartnerLoadError] = useState<string | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");

  // Loader configs state
  const [loaderConfigs, setLoaderConfigs] = useState<LoaderConfig[]>([]);
  const [loadingLoaderConfigs, setLoadingLoaderConfigs] = useState(false);
  const [loaderConfigsError, setLoaderConfigsError] = useState<string | null>(
    null
  );
  const [activeLoader, setActiveLoader] = useState<LoaderConfig | null>(null); // active selected loader
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  // Sorting state
  type SortKey = 'createdAt' | 'loaderId' | 'templateName' | 'loaderType' | 'uploadedBy';
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const setSort = (key: SortKey, dir: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDir(dir);
  };

  // Fetch partners
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingPartners(true);
      setPartnerLoadError(null);
      try {
        const response: any = await api.get("/api/partner?page=0&size=100");
        const content = Array.isArray(response?.content)
          ? response.content
          : [];
        const mapped: Partner[] = content.map((p: any) => ({
          id: p.id,
          partnerName: p.partnerName,
        }));
        if (!alive) return;
        setPartners(mapped);
      } catch (e: any) {
        if (!alive) return;
        setPartnerLoadError(e?.message || "Failed to load partners");
        setPartners([]);
      } finally {
        if (alive) setLoadingPartners(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Fetch loader configs for selected partner
  const fetchLoaderConfigs = async (selectedPartnerId: string) => {
    if (!selectedPartnerId) return;
    setLoadingLoaderConfigs(true);
    setLoaderConfigsError(null);

    try {
      const response: any = await uploadApi.get(
        `/api/partners/${selectedPartnerId}/configs`
      );
      const data = response?.data || response; // support either raw data or axios response
      const loadersSrc = Array.isArray(data?.loaders) ? data.loaders : [];

      const mapped: LoaderConfig[] = loadersSrc.map(
        (item: any, idx: number) => ({
          id: item.loaderId || item.id || `row-${idx}`,
          loaderId: item.loaderId || item.id || "",
          templateName: item.templateName || item.name || "",
          loaderType: item.loaderType || item.type || "",
          uploadedBy: item.uploadedBy || item.createdBy || "",
          downloadUrl: item.downloadUrl || item.fileUrl || "",
          createdAt: item.date || item.createdAt || "",
        })
      );

      setLoaderConfigs(mapped);
    } catch (err: any) {
      console.error(
        "Fetching loader configs failed:",
        err?.response?.data || err?.message
      );
      setLoaderConfigs([]);
      setLoaderConfigsError("Failed to fetch loader configs");
    } finally {
      setLoadingLoaderConfigs(false);
    }
  };
  const handleDownload = async (
    partnerId: string,
    loaderId: string,
    fileName?: string
  ) => {
    if (!partnerId || !loaderId) return;
    const downloadUrl = `/api/partners/${partnerId}/loader-transformation-configs/${loaderId}/download`;
    try {
      await uploadApi.download(downloadUrl, fileName || "loader-config.xlsx");
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed, check console for details");
    }
  };
  // File upload handler
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedPartnerId) return;
    const file = files[0];
    const maxSize = 5 * 1024 * 1024;
    const allowedExt = [".xlsx", ".xls"];
    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
    if (!allowedExt.includes(ext)) {
      alert("Please upload only Excel files (.xlsx or .xls)");
      return;
    }
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sheetName", "Transformation Config");
    try {
      await uploadApi.post(
        `/api/partners/${selectedPartnerId}/configs/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setToast({ type: 'success', message: 'File uploaded successfully' });
      fetchLoaderConfigs(selectedPartnerId);
    } catch (err: any) {
      console.error("Upload failed:", err?.response?.data || err?.message);
      setToast({ type: 'error', message: 'Upload failed' });
      alert("Upload failed, check console for details");
    }
  };

  const filteredLoaderConfigs = React.useMemo(() => {
    if (!searchTerm.trim()) return loaderConfigs;
    const q = searchTerm.toLowerCase();
    return loaderConfigs.filter(l =>
      (l.loaderId || '').toLowerCase().includes(q) ||
      (l.templateName || '').toLowerCase().includes(q) ||
      (l.uploadedBy || '').toLowerCase().includes(q)
    );
  }, [loaderConfigs, searchTerm]);

  const sortedFilteredLoaderConfigs = React.useMemo(() => {
    const arr = [...filteredLoaderConfigs];
    const dir = sortDir === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      let av: any = a[sortKey] || '';
      let bv: any = b[sortKey] || '';
      if (sortKey === 'createdAt') {
        av = av ? new Date(av).getTime() : 0;
        bv = bv ? new Date(bv).getTime() : 0;
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });
    return arr;
  }, [filteredLoaderConfigs, sortKey, sortDir]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!selectedPartnerId) {
      setLoaderConfigs([]);
      setLoaderConfigsError(null);
      setActiveLoader(null);
    }
  }, [selectedPartnerId]);

  return (
    <div className="min-h-dvh flex flex-col bg-gray-100 p-4">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow text-sm text-white ${toast.type==='success'?'bg-green-600':'bg-red-600'}`}
        >
          <div className="flex items-start gap-3">
            <span>{toast.message}</span>
            <button
              className="text-white/80 hover:text-white text-xs"
              onClick={() => setToast(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <form className="space-y-4">
        <div className="grid lg:grid-cols-4 gap-4 items-end">
          <Select
            label="Partner"
            items={
              loadingPartners
                ? [{ label: "Loading...", value: "" }]
                : partners.map((p) => ({ label: p.partnerName, value: p.id }))
            }
            name="partner"
            disabled={loadingPartners}
            onValueChange={(details: any) => {
              const value =
                typeof details === "string" ? details : details?.value;
              setSelectedPartnerId(value);
              setActiveLoader(null); // clear active loader when partner changes
              fetchLoaderConfigs(value);
            }}
          />
          <Select items={["MFI"]} label="Loader Type" name="Loader Type" />
          <Button
            variant="tertiary"
            type="reset"
            onClick={() => {
              setSelectedPartnerId("");
              setLoaderConfigs([]);
              setActiveLoader(null); // also clear active loader on reset
            }}
          >
            Reset
          </Button>
          <div className="border border-gray-300 rounded-md p-4 lg:col-span-4">
            <Upload
              size="lg"
              variant="extended"
              disabled={!selectedPartnerId}
              accept=".xlsx,.xls"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFileUpload(e.target.files)
              }
            />
            <p className="text-sm text-gray-600 mt-2">
              Upload Excel files (.xlsx, .xls) up to 5MB
            </p>
          </div>
        </div>
        {partnerLoadError && (
          <p className="text-xs text-red-600">{partnerLoadError}</p>
        )}
      </form>

      <div className="mt-7 space-y-3">
        <Text fontWeight="semibold" size="xl" className="text-primary-blue">
          Config Loader
        </Text>
        <Tabs size="sm" defaultValue="nb" variant="underline">
          <TabsContent value="nb">
            {!selectedPartnerId ? (
              <div className="p-10 border border-dashed rounded-lg bg-white text-center text-sm text-gray-600">
                <p className="font-medium text-gray-700 mb-1">No Partner Selected</p>
                <p>Select a partner from the dropdown above to view loader configurations.</p>
              </div>
            ) : (
              <>
                {/* Search Bar */}
                <div className="mb-4 flex items-center gap-3">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Loader ID, Template Name, or Uploaded By"
                    className="w-full max-w-md px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                  />
                  {searchTerm && (
                    <Button size="sm" variant="tertiary" onClick={() => setSearchTerm('')}>Clear</Button>
                  )}
                </div>
                {activeLoader && (
                  <div className="mb-4 p-4 border rounded bg-white shadow-sm text-sm space-y-1">
                    <p><span className="font-semibold">Active Loader ID:</span> {activeLoader.loaderId || '—'}</p>
                    <p><span className="font-semibold">Template Name:</span> {activeLoader.templateName || '—'}</p>
                    <p><span className="font-semibold">Type:</span> {activeLoader.loaderType || '—'}</p>
                    <p><span className="font-semibold">Uploaded By:</span> {activeLoader.uploadedBy || '—'}</p>
                    <p><span className="font-semibold">Date:</span> {activeLoader.createdAt ? new Date(activeLoader.createdAt).toLocaleString() : '—'}</p>
                  </div>
                )}
                {/* Desktop / Tablet Table */}
                <div className="hidden md:block">
                  <Table.ScrollContainer type="always">
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                      <Table className="min-w-full">
                        <Table.Head>
                          <Table.Row className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-800 text-xs uppercase tracking-wide">
                            <Table.Th className="select-none !py-3 !pl-4"> 
                              <div className="flex items-center gap-1">
                                <span>Date</span>
                                <span
                                  className={`text-[10px] leading-none cursor-pointer ${sortKey==='createdAt'&&sortDir==='asc'?'text-indigo-600':'text-gray-400'}`}
                                  onClick={() => setSort('createdAt','asc')}
                                >▲</span>
                                <span
                                  className={`text-[10px] leading-none cursor-pointer -mt-1 ${sortKey==='createdAt'&&sortDir==='desc'?'text-indigo-600':'text-gray-400'}`}
                                  onClick={() => setSort('createdAt','desc')}
                                >▼</span>
                              </div>
                            </Table.Th>
                            <Table.Th className="select-none !py-3">
                              <div className="flex items-center gap-1">
                                <span>Loader ID</span>
                                <span
                                  className={`text-[10px] cursor-pointer ${sortKey==='loaderId'&&sortDir==='asc'?'text-indigo-600':'text-gray-400'}`}
                                  onClick={() => setSort('loaderId','asc')}
                                >▲</span>
                                <span
                                  className={`text-[10px] cursor-pointer -mt-1 ${sortKey==='loaderId'&&sortDir==='desc'?'text-indigo-600':'text-gray-400'}`}
                                  onClick={() => setSort('loaderId','desc')}
                                >▼</span>
                              </div>
                            </Table.Th>
                            <Table.Th className="select-none !py-3">
                              <div className="flex items-center gap-1">
                                <span>Template Name</span>
                                <span
                                  className={`text-[10px] cursor-pointer ${sortKey==='templateName'&&sortDir==='asc'?'text-indigo-600':'text-gray-400'}`}
                                  onClick={() => setSort('templateName','asc')}
                                >▲</span>
                                <span
                                  className={`text-[10px] cursor-pointer -mt-1 ${sortKey==='templateName'&&sortDir==='desc'?'text-indigo-600':'text-gray-400'}`}
                                  onClick={() => setSort('templateName','desc')}
                                >▼</span>
                              </div>
                            </Table.Th>
                            <Table.Th className="select-none !py-3">
                              <div className="flex items-center gap-1">
                                <span>Loader Type</span>
                                <span
                                  className={`text-[10px] cursor-pointer ${sortKey==='loaderType'&&sortDir==='asc'?'text-indigo-600':'text-gray-400'}`}
                                  onClick={() => setSort('loaderType','asc')}
                                >▲</span>
                                <span
                                  className={`text-[10px] cursor-pointer -mt-1 ${sortKey==='loaderType'&&sortDir==='desc'?'text-indigo-600':'text-gray-400'}`}
                                  onClick={() => setSort('loaderType','desc')}
                                >▼</span>
                              </div>
                            </Table.Th>
                            <Table.Th className="select-none !py-3">
                              <div className="flex items-center gap-1">
                                <span>Uploaded By</span>
                                <span
                                  className={`text-[10px] cursor-pointer ${sortKey==='uploadedBy'&&sortDir==='asc'?'text-indigo-600':'text-gray-400'}`}
                                  onClick={() => setSort('uploadedBy','asc')}
                                >▲</span>
                                <span
                                  className={`text-[10px] cursor-pointer -mt-1 ${sortKey==='uploadedBy'&&sortDir==='desc'?'text-indigo-600':'text-gray-400'}`}
                                  onClick={() => setSort('uploadedBy','desc')}
                                >▼</span>
                              </div>
                            </Table.Th>
                            <Table.Th className="!py-3 pr-4">Action</Table.Th>
                          </Table.Row>
                        </Table.Head>
                        <Table.Body>
                          {loadingLoaderConfigs && (
                            <Table.Row>
                              <Table.Cell className="!py-4 text-center text-gray-500">Loading...</Table.Cell>
                              <Table.Cell /> <Table.Cell /> <Table.Cell /> <Table.Cell /> <Table.Cell />
                            </Table.Row>
                          )}
                          {!loadingLoaderConfigs && loaderConfigsError && (
                            <Table.Row>
                              <Table.Cell className="!py-4 text-center text-red-600">{loaderConfigsError}</Table.Cell>
                              <Table.Cell /> <Table.Cell /> <Table.Cell /> <Table.Cell /> <Table.Cell />
                            </Table.Row>
                          )}
                          {!loadingLoaderConfigs && !loaderConfigsError && loaderConfigs.length === 0 && (
                            <Table.Row>
                              <Table.Cell className="!py-4 text-center text-gray-500">No records</Table.Cell>
                              <Table.Cell /> <Table.Cell /> <Table.Cell /> <Table.Cell /> <Table.Cell />
                            </Table.Row>
                          )}
                          {!loadingLoaderConfigs && !loaderConfigsError && sortedFilteredLoaderConfigs.length === 0 && loaderConfigs.length > 0 && (
                            <Table.Row>
                              <Table.Cell className="!py-4 text-center text-gray-500">No matches</Table.Cell>
                              <Table.Cell /> <Table.Cell /> <Table.Cell /> <Table.Cell /> <Table.Cell />
                            </Table.Row>
                          )}
                          {!loadingLoaderConfigs && !loaderConfigsError && sortedFilteredLoaderConfigs.map((row, idx) => {
                            const dateStr = row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '';
                            const isActive = activeLoader?.loaderId === row.loaderId;
                            const pillColor = (row.loaderType||'').toLowerCase() === 'mfi' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600';
                            return (
                              <Table.Row
                                key={row.id || row.loaderId || dateStr}
                                className={`text-sm transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-indigo-50/60 ${isActive ? '!bg-indigo-100' : ''}`}
                                onClick={() => {
                                  setActiveLoader(row);
                                  if (row.loaderId) console.log('Active loader selected:', row.loaderId);
                                }}
                              >
                                <Table.Cell className="!py-3 !pl-4 whitespace-nowrap">{dateStr}</Table.Cell>
                                <Table.Cell className="!py-3 font-medium text-gray-700">{row.loaderId || '—'}</Table.Cell>
                                <Table.Cell className="!py-3 max-w-[180px] truncate" title={row.templateName || ''}>{row.templateName || '—'}</Table.Cell>
                                <Table.Cell className="!py-3">
                                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium inline-block ${pillColor}`}>{row.loaderType || '—'}</span>
                                </Table.Cell>
                                <Table.Cell className="!py-3 text-gray-600">{row.uploadedBy || '—'}</Table.Cell>
                                <Table.Cell className="!py-3 pr-4">
                                  <button
                                    className="text-indigo-600 hover:text-indigo-700 underline decoration-indigo-300 hover:decoration-indigo-500 decoration-2 text-xs font-semibold"
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      if (!selectedPartnerId || !row.loaderId) return;
                                      const url = `/api/partners/${selectedPartnerId}/loader-transformation-configs/${row.loaderId}/download`;
                                      try {
                                        await uploadApi.download(url, row.templateName || 'loader-config.xlsx');
                                      } catch (err) {
                                        console.error('Download failed:', err);
                                        alert('Download failed, check console for details');
                                      }
                                    }}
                                  >
                                    Download
                                  </button>
                                </Table.Cell>
                              </Table.Row>
                            );
                          })}
                        </Table.Body>
                      </Table>
                    </div>
                  </Table.ScrollContainer>
                </div>
                {/* Mobile Card List */}
                <div className="md:hidden space-y-3">
                  {loadingLoaderConfigs && (
                    <div className="p-4 text-center text-sm text-gray-500 border rounded bg-white">Loading...</div>
                  )}
                  {!loadingLoaderConfigs && loaderConfigsError && (
                    <div className="p-4 text-center text-sm text-red-600 border rounded bg-white">{loaderConfigsError}</div>
                  )}
                  {!loadingLoaderConfigs && !loaderConfigsError && loaderConfigs.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500 border rounded bg-white">No records</div>
                  )}
                  {!loadingLoaderConfigs && !loaderConfigsError && sortedFilteredLoaderConfigs.length === 0 && loaderConfigs.length > 0 && (
                    <div className="p-4 text-center text-sm text-gray-500 border rounded bg-white">No matches</div>
                  )}
                  {!loadingLoaderConfigs && !loaderConfigsError && sortedFilteredLoaderConfigs.map(card => {
                    const dateStr = card.createdAt ? new Date(card.createdAt).toLocaleDateString() : '';
                    const pillColor = (card.loaderType||'').toLowerCase() === 'mfi' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600';
                    const isActive = activeLoader?.loaderId === card.loaderId;
                    return (
                      <div
                        key={card.id || card.loaderId || dateStr}
                        className={`border rounded-lg bg-white p-4 shadow-sm flex flex-col gap-2 transition-colors ${isActive ? 'ring-2 ring-indigo-300' : 'hover:bg-indigo-50/40'}`}
                        onClick={() => setActiveLoader(card)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-800">{card.templateName || '—'}</h3>
                            <p className="text-[11px] text-gray-500">{dateStr}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${pillColor}`}>{card.loaderType || '—'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-gray-600">
                          <span className="text-gray-500">Loader ID</span><span className="truncate">{card.loaderId || '—'}</span>
                          <span className="text-gray-500">Uploaded</span><span>{card.uploadedBy || '—'}</span>
                        </div>
                        <button
                          className="self-start mt-1 text-indigo-600 hover:text-indigo-700 underline decoration-indigo-300 hover:decoration-indigo-500 text-[11px] font-medium"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!selectedPartnerId || !card.loaderId) return;
                            const url = `/api/partners/${selectedPartnerId}/loader-transformation-configs/${card.loaderId}/download`;
                            try {
                              await uploadApi.download(url, card.templateName || 'loader-config.xlsx');
                            } catch (err) {
                              console.error('Download failed:', err);
                              alert('Download failed, check console for details');
                            }
                          }}
                        >
                          Download
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
