"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  ToolShell,
  useTool,
} from "@itsjust/core";
import {
  configBuilderTool,
  ToolCanvas,
  ToolToolbar,
  ToolSidebar,
} from "@/tool";
import type { ConfigType, SystemService } from "@/tool";

export default function ToolClient() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const tool = useTool(configBuilderTool, canvasRef);
  const setToolData = tool.state.setData;
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      window.innerWidth > 768 &&
      configBuilderTool.config.features.sidebar,
  );

  // --- Service management callbacks ---
  const addService = useCallback(() => {
    const name = `service-${Date.now()}`;
    const newService: SystemService = {
      name,
      image: "nginx:alpine",
      ports: [80],
    };
    setToolData((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));
  }, [setToolData]);

  const removeService = useCallback(
    (index: number) => {
      setToolData((prev) => ({
        ...prev,
        services: prev.services.filter((_, i) => i !== index),
      }));
    },
    [setToolData],
  );

  const updateService = useCallback(
    (index: number, service: SystemService) => {
      setToolData((prev) => {
        const services = [...prev.services];
        services[index] = service;
        return { ...prev, services };
      });
    },
    [setToolData],
  );

  // --- Title editing ---
  const updateTitle = useCallback(
    (title: string) => {
      setToolData((prev) => ({ ...prev, title }));
    },
    [setToolData],
  );

  const updateType = useCallback(
    (type: string) => {
      setToolData((prev) => ({ ...prev, type: type as ConfigType }));
    },
    [setToolData],
  );

  const updateDescription = useCallback(
    (description: string) => {
      setToolData((prev) => ({ ...prev, description }));
    },
    [setToolData],
  );

  const updateNotes = useCallback(
    (notes: string) => {
      setToolData((prev) => ({ ...prev, notes }));
    },
    [setToolData],
  );

  const updateNetwork = useCallback(
    (network: string) => {
      setToolData((prev) => ({ ...prev, network }));
    },
    [setToolData],
  );

  const updateVolumeDriver = useCallback(
    (volumeDriver: string) => {
      setToolData((prev) => ({ ...prev, volumeDriver }));
    },
    [setToolData],
  );

  // --- Build toolbar actions ---
  const toolbarActions = useMemo(
    () => ({
      ...tool.toolbarActions,
      onExport: tool.handleExport,
      supportedFormats: tool.supportedFormats,
    }),
    [tool.toolbarActions, tool.handleExport, tool.supportedFormats],
  );

  return (
    <>
      <ToolShell
        config={configBuilderTool.config}
        actions={toolbarActions}
        toolbar={
          <ToolToolbar
            type={tool.state.data.type}
            onTypeChange={updateType}
          />
        }
        sidebar={
          <ToolSidebar
            title={tool.state.data.title}
            description={tool.state.data.description}
            notes={tool.state.data.notes}
            services={tool.state.data.services}
            network={tool.state.data.network}
            volumeDriver={tool.state.data.volumeDriver}
            onAddService={addService}
            onRemoveService={removeService}
            onUpdateService={updateService}
            onUpdateTitle={updateTitle}
            onUpdateDescription={updateDescription}
            onUpdateNotes={updateNotes}
            onUpdateNetwork={updateNetwork}
            onUpdateVolumeDriver={updateVolumeDriver}
          />
        }
        sidebarOpen={sidebarOpen}
        onSidebarChange={(open) => setSidebarOpen(open)}
        canvas={
          <ToolCanvas
            title={tool.state.data.title}
            services={tool.state.data.services}
            network={tool.state.data.network}
            volumeDriver={tool.state.data.volumeDriver}
            type={tool.state.data.type}
            canvasRef={canvasRef}
          />
        }
      />
    </>
  );
}