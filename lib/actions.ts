"use server";

import { z } from "zod";
import { prisma } from "./prisma";
import { RescueStatus } from "./types";
import { revalidatePath } from "next/cache";

// Validation Schemas
const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const aiAnalysisSchema = z.object({
  animalType: z.string(),
  breed: z.string().optional(),
  injuries: z.array(z.string()),
  severity: z.enum(["Low", "Medium", "High"]),
  emergency: z.boolean(),
  confidence: z.number(),
  summary: z.string(),
  recommendation: z.string(),
});

const reportRescueSchema = z.object({
  id: z.string().uuid(),
  reporterName: z.string(),
  description: z.string(),
  address: z.string(),
  imageDataUrl: z.string().optional(),
  location: locationSchema,
  analysis: aiAnalysisSchema,
});

export async function submitRescueRequest(payload: unknown) {
  const parsed = reportRescueSchema.safeParse(payload);
  
  if (!parsed.success) {
    return { error: "Invalid payload data", details: parsed.error.issues };
  }
  
  const data = parsed.data;

  try {
    await prisma.rescueRequest.create({
      data: {
        id: data.id,
        reporterName: data.reporterName,
        description: data.description,
        address: data.address,
        imageDataUrl: data.imageDataUrl || "",
        status: "Request Created",
        location: JSON.stringify(data.location),
        analysis: JSON.stringify(data.analysis),
      },
    });

    await prisma.timelineEvent.create({
      data: {
        rescueRequestId: data.id,
        status: "Request Created",
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/ngo");

    return { success: true, id: data.id };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function updateRescueStatus(id: string, status: RescueStatus, patchData?: any) {
  try {
    const updateData: any = { status };
    if (patchData?.ngo) updateData.ngo = JSON.stringify(patchData.ngo);
    if (patchData?.volunteer) updateData.volunteer = JSON.stringify(patchData.volunteer);

    await prisma.rescueRequest.update({
      where: { id },
      data: updateData,
    });

    await prisma.timelineEvent.create({
      data: {
        rescueRequestId: id,
        status,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/ngo");
    revalidatePath("/volunteer");
    revalidatePath(`/tracking/${id}`);

    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function fetchRescueRequests() {
  const requests = await prisma.rescueRequest.findMany({
    include: { timeline: true },
    orderBy: { createdAt: "desc" },
  });

  return requests.map(r => ({
    ...r,
    location: JSON.parse(r.location),
    analysis: JSON.parse(r.analysis),
    ngo: r.ngo ? JSON.parse(r.ngo) : undefined,
    volunteer: r.volunteer ? JSON.parse(r.volunteer) : undefined,
    timeline: r.timeline.map(t => ({ status: t.status, time: t.time.toISOString() })),
  }));
}
