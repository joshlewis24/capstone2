"use client";
import { useState, useRef, useEffect } from "react";
import { Bell, UploadSimple, DownloadSimple, X, UploadSimpleIcon } from "@phosphor-icons/react";
import { Button, Select } from "@hdfclife-insurance/one-x-ui";
import api from "../services/api";
import RawLoader from "@/services/RawLoader";

interface Partner {
  id: string | number;
  partnerName: string;
}

// UploadPanel component
const UploadPanel = ({ onClose }: { onClose: () => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [partners, setPartners] = useState<Partner[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [partnerLoadError, setPartnerLoadError] = useState<string | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [partnerPage, setPartnerPage] = useState(0);
  const [hasMorePartners, setHasMorePartners] = useState(true);

  const [loaderType, setLoaderType] = useState<string>("MFI");

  const hasFetchedRef = useRef(false);

  // Fetch partners
  const fetchPartners = async (page: number) => {
    setLoadingPartners(true);
    setPartnerLoadError(null);
    try {
      const data: any = await api.get(`/api/partner?page=${page}&size=100`);
      const content = Array.isArray(data?.content) ? data.content : [];
      const mapped: Partner[] = content.map((p: any) => ({
        id: p.id,
        partnerName: p.partnerName,
      }));

      setPartners((prev) => [...prev, ...mapped]);
      setHasMorePartners(content.length > 0);
    } catch (e: any) {
      setPartnerLoadError(e?.message || "Failed to load partners");
    } finally {
      setLoadingPartners(false);
    }
  };

  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchPartners(0);
      hasFetchedRef.current = true;
    }
  }, []);

  const handlePartnerDropdownScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (
      target.scrollHeight - target.scrollTop <= target.clientHeight + 20 &&
      !loadingPartners &&
      hasMorePartners
    ) {
      setPartnerPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchPartners(nextPage);
        return nextPage;
      });
    }
  };

  // File selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) validateAndSetFiles(Array.from(files));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    validateAndSetFiles(files);
  };

  const validateAndSetFiles = (fileArray: File[]) => {
    const validFiles = fileArray.filter(
      (file) =>
        ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(file.type) &&
        file.size <= 100 * 1024 * 1024
    );

    if (fileArray.length > 5) {
      setError("Maximum 5 files allowed");
      return;
    }

    if (validFiles.length !== fileArray.length) {
      setError("Only XLS/XLSX files under 100MB are allowed");
      return;
    }

    setSelectedFiles(validFiles);
    setError(null);
  };

  const handleBrowseClick = () => fileInputRef.current?.click();
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();

  // Upload handler
  const handleUpload = async () => {
    if (!selectedPartnerId || selectedFiles.length === 0) {
      setError("Please select a partner and at least one file");
      return;
    }

    const CONFIG_ID = "68dd882d46667987f3297302"; // 🔹 Hardcoded for now
    console.log("Using configId:", CONFIG_ID);

    try {
      for (const file of selectedFiles) {
        await RawLoader.uploadLoaderData(selectedPartnerId, CONFIG_ID, file);
      }
      alert("✅ Upload successful!");
      setSelectedFiles([]);
    } catch (err) {
      alert("❌ Upload failed, check console.");
    }
  };

  return (
    <div
      className="flex flex-col h-full w-full max-w-full sm:max-w-sm md:max-w-md lg:w-[400px] bg-white shadow-xl gap-4 p-4 overflow-y-auto relative lg:rounded-none rounded-t-xl lg:static lg:inset-auto animate-slide-in-right"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
        aria-label="Close upload panel"
      >
        <X size={20} />
      </button>
      <h2 className="text-lg text-[#00538A] font-semibold mb-2 lg:mb-4">Upload</h2>
      {/* Partner & Loader Type */}
      <div className="flex flex-col gap-4">
        <Select
          items={
            partners.length === 0 && loadingPartners
              ? [{ label: "Loading...", value: "" }]
              : partners.map((p) => ({ label: p.partnerName, value: p.id }))
          }
          name="partner"
          valuePlaceholder="Partner Name"
          disabled={loadingPartners && partners.length === 0}
          onValueChange={(details: any) => {
            const value = typeof details === "string" ? details : details?.value;
            setSelectedPartnerId(value);
          }}
          onScroll={handlePartnerDropdownScroll}
        />
        {partnerLoadError && (
          <p className="text-xs text-red-500 -mt-2">{partnerLoadError}</p>
        )}
        <Select
          items={[{ label: "MFI", value: "MFI" }]}
          name="loaderType"
          valuePlaceholder="Loader Type"
          onValueChange={(details: any) => {
            const value = typeof details === "string" ? details : details?.value;
            setLoaderType(value);
          }}
        />
      </div>
      {/* Drop Zone */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/40 mt-2"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        role="region"
        aria-label="File upload dropzone"
      >
        <div className="mb-3 bg-[#FDE7E8] p-2 rounded-full">
          <UploadSimpleIcon size={32} className="text-gray-400" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept=".xls,.xlsx"
          onChange={handleFileChange}
        />
        <p className="text-gray-600 text-sm sm:text-base">Choose a file or drag and drop here</p>
        <p className="text-xs text-gray-400 mb-3">XLS, XLSX (Max 100 MB)</p>
        <Button
          size="sm"
          disabled={!selectedPartnerId}
          variant="primary"
          color="primary"
          className="mt-1"
          onClick={handleBrowseClick}
        >
          Browse
        </Button>
      </div>
      {error && <p className="text-red-500 text-xs -mb-2">{error}</p>}
      {selectedFiles.length > 0 && (
        <div className="mb-2">
          <p className="text-sm font-semibold">Selected Files:</p>
          <ul className="text-sm text-gray-600 space-y-0.5 max-h-32 overflow-auto pr-1">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex justify-between gap-2">
                <span className="truncate" title={file.name}>{file.name}</span>
                <span className="text-gray-400 text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-xs text-gray-400">Upload maximum 5 files at a time.</p>
      <div className="mt-auto flex gap-3 pt-2">
        <Button
          size="sm"
          variant="tertiary"
          color="gray"
          className="flex-1"
          onClick={() => {
            setSelectedFiles([]);
            setError(null);
          }}
        >
          Clear
        </Button>
        <Button
          size="sm"
            disabled={!selectedPartnerId || selectedFiles.length === 0}
            variant="primary"
            color="primary"
            className="flex-1"
            onClick={handleUpload}
          >
            Upload
          </Button>
      </div>
    </div>
  );
};

// RightSidePanel
interface RightSidePanelProps {
  notificationsCount?: number;
}

const RightSidePanel: React.FC<RightSidePanelProps> = ({ notificationsCount = 0 }) => {
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  return (
    <div className="flex">
      {showUploadPanel && (
        <div className="fixed inset-0 z-50 flex justify-end lg:static lg:inset-auto lg:z-auto">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setShowUploadPanel(false)}
            aria-hidden="true"
          />
          <UploadPanel onClose={() => setShowUploadPanel(false)} />
        </div>
      )}
      <div className="flex flex-col items-center gap-6 border-l border-gray-200 bg-white w-[60px] py-6">
        <div className="relative cursor-pointer" aria-label="Notifications">
          <Bell size={24} className="text-gray-700" />
          {notificationsCount > 0 && (
            <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
              {notificationsCount}
            </span>
          )}
        </div>
        <div
          className="cursor-pointer"
          onClick={() => setShowUploadPanel((prev) => !prev)}
          aria-label="Toggle upload panel"
        >
          <UploadSimple size={24} className="text-gray-700" />
        </div>
        <div className="cursor-pointer" aria-label="Downloads">
          <DownloadSimple size={24} className="text-gray-700" />
        </div>
      </div>
    </div>
  );
};

export default RightSidePanel;
