"use client";

import React, { useState } from "react";
import {
  Button,
  Select,
  Table,
  Tabs,
  TabsContent,
  Text,
} from "@hdfclife-insurance/one-x-ui";

export default function DashboardTableTemplate() {
  const [selectedPartner, setSelectedPartner] = useState<string>("");

  // Dummy data
  const partners = [
    { id: "p1", partnerName: "Partner A" },
    { id: "p2", partnerName: "Partner B" },
  ];

  const loaderConfigs = [
    {
      id: "1",
      createdAt: "2025-01-01",
      loaderId: "LDR001",
      templateName: "Template Alpha",
      loaderType: "MFI",
      uploadedBy: "John Doe",
    },
    {
      id: "2",
      createdAt: "2025-02-10",
      loaderId: "LDR002",
      templateName: "Template Beta",
      loaderType: "Other",
      uploadedBy: "Jane Smith",
    },
  ];

  return (
    <div className="min-h-dvh flex flex-col bg-gray-100 p-4">
      <form className="space-y-4">
        <div className="grid lg:grid-cols-3 gap-4 items-end">
          <Select
            label="Partner"
            items={partners.map((p) => ({ label: p.partnerName, value: p.id }))}
            name="partner"
            onValueChange={(value: any) =>
              setSelectedPartner(typeof value === "string" ? value : value.value)
            }
          />
          <Select items={["MFI"]} label="Loader Type" name="Loader Type" />
          <Button
            variant="tertiary"
            type="reset"
            onClick={() => setSelectedPartner("")}
          >
            Reset
          </Button>
        </div>
      </form>

      <div className="mt-7 space-y-3">
        <Text
          fontWeight="semibold"
          size="xl"
          className="text-primary-blue"
        >
          Config Loader
        </Text>
        <Tabs size="sm" defaultValue="nb" variant="underline">
          <TabsContent value="nb">
            {!selectedPartner ? (
              <div className="p-10 border border-dashed rounded-lg bg-white text-center text-sm text-gray-600">
                <p className="font-medium text-gray-700 mb-1">No Partner Selected</p>
                <p>Select a partner from the dropdown above to view loader configurations.</p>
              </div>
            ) : (
              <Table.ScrollContainer type="always">
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <Table className="min-w-full">
                    <Table.Head>
                      <Table.Row className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Loader ID</Table.Th>
                        <Table.Th>Template Name</Table.Th>
                        <Table.Th>Loader Type</Table.Th>
                        <Table.Th>Uploaded By</Table.Th>
                        <Table.Th>Action</Table.Th>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {loaderConfigs.map((row) => (
                        <Table.Row key={row.id}>
                          <Table.Cell>{row.createdAt}</Table.Cell>
                          <Table.Cell>{row.loaderId}</Table.Cell>
                          <Table.Cell>{row.templateName}</Table.Cell>
                          <Table.Cell>{row.loaderType}</Table.Cell>
                          <Table.Cell>{row.uploadedBy}</Table.Cell>
                          <Table.Cell>
                            <button
                              className="text-indigo-600 hover:text-indigo-700 underline text-xs"
                              onClick={() => alert("Download clicked")}
                            >
                              Download
                            </button>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              </Table.ScrollContainer>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
