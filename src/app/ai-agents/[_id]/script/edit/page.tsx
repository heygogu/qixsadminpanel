"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/webpage/color-picker";
import { WebpagePreview } from "@/components/webpage/preview";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";
import { cn } from "@/lib/utils";

import { Camera, Loader2 } from "lucide-react";

import henceforthApi from "@/utils/henceforthApis";

import { useGlobalContext } from "@/app/providers/Provider";
import { useParams, useRouter } from "next/navigation";

const webpageSettingsSchema = z.object({
  title: z
    .string()
    .min(1, "Page title is required")
    .max(35, "Title must be less than 35 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(80, "Description must be less than 80 characters"),
  primaryColor: z
    .string()
    .min(1, "Project color is required")
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
  accentColor: z
    .string()
    .min(1, "Sibebar  color is required")
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
});

type WebpageSettings = z.infer<typeof webpageSettingsSchema>;

function WebPageView() {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const { userInfo, Toast } = useGlobalContext();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<WebpageSettings>({
    resolver: zodResolver(webpageSettingsSchema),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  const fetchWebpageDetails = async () => {
    setIsLoading(true);
    try {
      const response = await henceforthApi?.SuperAdmin?.getAgent(params?._id);
      const data = response?.data?.script_data;

      reset({
        title: data.title ? data.title : userInfo?.workspace?.name,
        description: data.description
          ? data?.description
          : userInfo?.workspace?.description,
        primaryColor: data.colour || "#000000",
        accentColor: data?.font_colour || "#FFFFFF",
      });
    } catch (error) {
      Toast.error("Failed to load webpage details");
      console.error("Error fetching webpage details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSettings = watch();

  useEffect(() => {
    fetchWebpageDetails();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: WebpageSettings) => {
    if (!userInfo?.workspace?._id) {
      Toast.error("Workspace ID is missing");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        colour: data.primaryColor,
        font_colour: data.accentColor,
        workspace_id: userInfo.workspace?._id,
        key: userInfo?.workspace?.key,
      };
      // console.log(payload,"hghufwdgyufgweyudgfwegyufw")

      await henceforthApi.SuperAdmin.updateScript(params?._id, payload);
      Toast.success("Settings saved successfully");
      router.replace(`/ai-agents/${params?._id}/view`);
    } catch (error) {
      console.error("Error submitting form:", error);
      Toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <PageContainer>
      <div
        className={cn(
          " animate-in fade-in-50 duration-500",
          "slide-in-from-bottom-5"
        )}
      ></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl ">Webpage View</CardTitle>
              <CardDescription>
                Customize how your webpage looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Settings</CardTitle>
                    <CardDescription>
                      Customize how your webpage looks and feels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* <div className="flex flex-col items-center justify-center mb-6">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    id="logoUpload"
                    onChange={handleLogoUpload}
                  />

                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-2">
                      {currentSettings.logo ? (
                        <AvatarImage
                          src={henceforthApi.FILES.imageOriginal(
                            currentSettings.logo,
                            ""
                          )}
                          alt="Company Logo"
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="text-2xl text-white font-semibold bg-green-600">
                          {"HS"}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="absolute bottom-0 right-0 flex gap-1">
                      <Button
                        type="button"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-primary"
                        onClick={() =>
                          document.getElementById("logoUpload")?.click()
                        }
                        disabled={isImageLoading}
                      >
                        {isImageLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera color="white" className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Label className="text-center mt-2 text-sm text-gray-600">
                    Webpage Logo
                  </Label>
                </div> */}
                    {/* <div className="space-y-2">
                      <Label htmlFor="agent">Agent</Label>
                      <Select
                        value={currentSettings.agent}
                        onValueChange={(value) => setValue("agent", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an agent" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {agentListing?.length > 0 ? (
                            agentListing?.map((agent: any) => (
                              <SelectItem key={agent.value} value={agent.value}>
                                {agent.label}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="nodata" disabled>
                              No agents available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {errors.agent && (
                        <p className="text-red-500 text-sm">
                          {errors.agent.message}
                        </p>
                      )}
                    </div> */}

                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-md">
                          <ColorPicker
                            label="Project Color(Global)"
                            value={currentSettings.primaryColor}
                            onChange={(value) =>
                              setValue("primaryColor", value)
                            }
                          />
                          {errors.primaryColor && (
                            <p className="text-red-500 text-sm">
                              {errors.primaryColor.message}
                            </p>
                          )}
                        </div>
                        <div className="bg-white rounded-md">
                          <ColorPicker
                            label="Sidebar Font Color"
                            value={currentSettings.accentColor}
                            onChange={(value) => setValue("accentColor", value)}
                          />
                          {errors.accentColor && (
                            <p className="text-red-500 text-sm">
                              {errors.accentColor.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Page Title</Label>
                      <Input id="title" {...register("title")} />
                      {errors.title && (
                        <p className="text-red-500 text-sm">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" {...register("description")} />
                      {errors.description && (
                        <p className="text-red-500 text-sm">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    {/* <div className="space-y-2">
                  <Label htmlFor="key">Key</Label>
                  <Input
                    id="key"
                    {...register("key")}
                  />
                  {errors.key && (
                    <p className="text-red-500 text-sm">{errors.key.message}</p>
                  )}
                </div> */}
                  </CardContent>
                </Card>

                <Card className="lg:sticky lg:top-20">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>

                    <CardDescription>
                      See how your webpage will look
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WebpagePreview
                      settings={currentSettings}
                      isImageLoading={isImageLoading}
                    />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              className="bg-primary text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Webpage"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </PageContainer>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <WebPageView />
    </DashboardLayout>
  );
}
