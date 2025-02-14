"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import {
  Brain,
  Camera,
  LibraryBig,
  Loader2,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import henceforthApi from "@/utils/henceforthApis";
import { useParams } from "next/navigation";
import { MultiSelect } from "@/components/common/MultiSelect";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  voice: z.string().optional(),
  twilio_config: z.string().optional(),
  model: z.string(),
  knowledgeBase: z.array(z.string()).optional(),
  idleReminder: z.boolean().optional(),
  callDuration: z.number().min(0).max(120).optional(),
  allowCallCut: z.boolean().optional(),
  callTransfer: z.boolean().optional(),
  sendMessage: z.boolean(),
  realTimeBooking: z.boolean().optional(),
  chat_prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  chat_firstMessage: z
    .string()
    .min(10, "First message must be at least 10 characters"),
  call_prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  call_firstMessage: z
    .string()
    .min(10, "First message must be at least 10 characters"),
});

function EditDefaultAgent() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [photoString, setPhotoString] = useState<string | null>(null);
  const [knowledgeBaseOptions, setKnowledgeBaseOptions] = useState<any>([]);
  const knowledgeBasesforSelection = knowledgeBaseOptions?.map(
    (option: any) => ({
      value: option?._id,
      label: option?.name,
      icon: LibraryBig,
    })
  );

  const [defaultKnowledgeBase, setDefaultKnowledgeBase] = useState<any>([]);
  console.log(defaultKnowledgeBase, "defaultKnowledgeBase");
  const [phoneNumberListing, setPhoneNumberListing] = useState<any>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "gemini",
      knowledgeBase: knowledgeBaseOptions,
    },
  });

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const apiRes = await henceforthApi.SuperAdmin.getAgentTemplateDetails(
          params?._id as string
        );
        setDefaultKnowledgeBase(
          apiRes?.data?.knowledge_base_id?.map((option: any) => option?._id)
        );
        debugger;
        if (apiRes?.data) {
          form.reset({
            name: apiRes?.data?.name,
            voice: apiRes?.data?.voice ?? "",
            twilio_config: apiRes?.data?.twilio_config?._id ?? "",
            model: apiRes?.data?.ai_model,
            knowledgeBase: defaultKnowledgeBase,
            idleReminder: apiRes?.data?.idle_reminder,
            callDuration: apiRes?.data?.call_limit_duration ?? 0,
            allowCallCut: apiRes?.data?.call_cut_ability,
            callTransfer: apiRes?.data?.call_transfer,
            sendMessage: apiRes?.data?.send_message,
            realTimeBooking: apiRes?.data?.real_time_booking,
            chat_prompt: apiRes?.data?.chat_prompt,
            chat_firstMessage: apiRes?.data?.chat_first_message,
            call_prompt: apiRes?.data?.call_prompt,
            call_firstMessage: apiRes?.data?.call_first_message,
          });
          setLogoPreview(apiRes?.data?.image);
          setPhotoString(apiRes?.data?.image);
        }
      } catch (error) {
        toast.error("Failed to fetch agent data");
      } finally {
        setIsLoading(false);
      }
    };

    const getKnowledgeBaseOptions = async () => {
      try {
        const apiRes = await henceforthApi.SuperAdmin.getKnowledgeBases();
        setKnowledgeBaseOptions(apiRes?.data);
      } catch (error) {
        toast.error("Failed to fetch knowledge bases");
      }
    };
    const getPhoneNumbers = async () => {
      try {
        const apiRes = await henceforthApi.SuperAdmin.getPhoneNumbers();
        setPhoneNumberListing(apiRes);
      } catch (error) {
        setPhoneNumberListing([]);
      }
    };
    getPhoneNumbers();

    fetchAgentData();
    getKnowledgeBaseOptions();
  }, [params?._id, form]);

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload JPEG, PNG, or WebP.");
        return;
      }

      if (file.size > maxSize) {
        toast.error("File is too large. Maximum size is 5MB.");
        return;
      }

      setIsImageLoading(true);
      setLogoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);
      try {
        const apiRes = await henceforthApi.SuperAdmin.imageUpload(formData);
        setPhotoString(apiRes?.file_name);
      } catch (error) {
        toast.error("Failed to upload image");
      } finally {
        setIsImageLoading(false);
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    debugger;
    const payload = {
      name: values.name,
      type: "Agent",
      voice: values.voice,
      image: photoString,
      chat_first_message: values.chat_firstMessage,
      chat_prompt: values.chat_prompt,
      call_first_message: values.call_firstMessage,
      call_prompt: values.call_prompt,
      twilio_config: values.twilio_config,
      country_code: "+91",
      knowledge_base_id: defaultKnowledgeBase,
      ai_model: values.model,
      idle_reminder: values.idleReminder,
      call_cut_ability: values.allowCallCut,
      call_limit_duration: values.callDuration,
      call_transfer: values.callTransfer,
      send_message: values.sendMessage,
      real_time_booking: values.realTimeBooking,
    };

    try {
      await henceforthApi.SuperAdmin.updateAgentTemplate(
        params?._id as string,
        payload
      );
      toast.success("Agent updated successfully");
      // router.push("/aiagents/page/1");

      const path = "/default-agent/page/1";

      const link = document.createElement("a");
      link.href = path;
      link.setAttribute("data-next-link", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Failed to update agent");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight ">Edit Agent</h2>
        <p className="text-muted-foreground">
          Modify your AI agent's capabilities, personality, and behavior
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="pb-3">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center mb-6">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    id="logoUpload"
                    onChange={handleLogoUpload}
                  />
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-2 border-gray-200">
                      {photoString ? (
                        <AvatarImage
                          src={henceforthApi.FILES.imageOriginal(photoString)}
                          alt="Agent Image"
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="text-2xl bg-gray-100">
                          <User className="h-10 w-10" />
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
                  <FormLabel className="text-center mt-2 text-sm text-gray-600">
                    Agent Image
                  </FormLabel>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agent Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter agent name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AI Model</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select AI model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem value="gemini">Gemini</SelectItem>
                            <SelectItem value="chatgpt">ChatGPT</SelectItem>
                            <SelectItem value="deepseek">DeepSeek</SelectItem>
                            <SelectItem value="claude">Claude</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="voice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voice</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select voice" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem value="aura-asteria-en">
                              Asteria (English - US, Female)
                            </SelectItem>
                            <SelectItem value="aura-luna-en">
                              Luna (English - US, Female)
                            </SelectItem>
                            <SelectItem value="aura-stella-en">
                              Stella (English - US, Female)
                            </SelectItem>
                            <SelectItem value="aura-athena-en">
                              Athena (English - UK, Female)
                            </SelectItem>
                            <SelectItem value="aura-hera-en">
                              Hera (English - US, Female)
                            </SelectItem>
                            <SelectItem value="aura-orion-en">
                              Orion (English - US, Male)
                            </SelectItem>
                            <SelectItem value="aura-arcas-en">
                              Arcas (English - US, Male)
                            </SelectItem>
                            <SelectItem value="aura-perseus-en">
                              Perseus (English - US, Male)
                            </SelectItem>
                            <SelectItem value="aura-angus-en">
                              Angus (English - Ireland, Male)
                            </SelectItem>
                            <SelectItem value="aura-orpheus-en">
                              Orpheus (English - US, Male)
                            </SelectItem>
                            <SelectItem value="aura-helios-en">
                              Helios (English - UK, Male)
                            </SelectItem>
                            <SelectItem value="aura-zeus-en">
                              Zeus (English - US, Male)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="knowledgeBase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Knowledge Base</FormLabel>

                        <MultiSelect
                          options={knowledgeBasesforSelection}
                          onValueChange={setDefaultKnowledgeBase}
                          defaultValue={defaultKnowledgeBase}
                          placeholder="Select Knowledge Bases"
                          variant="inverted"
                          animation={2}
                          maxCount={8}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chat Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="chat_firstMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the first message the agent will send..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chat_prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the system prompt for the agent..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <hr className="text-gray-400"></hr>
              <CardHeader>
                <CardTitle>Call Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="call_firstMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the first message the agent will send..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="call_prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the system prompt for the agent..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Call Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="twilio_config"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            defaultValue=""
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Phone Number" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {phoneNumberListing?.map((option: any) => (
                                <SelectItem value={option?._id}>
                                  {option?.phone_number}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="idleReminder"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Idle Reminder
                        </FormLabel>
                        <FormDescription>
                          Notify when the customer is inactive
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowCallCut"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Allow Call Cut
                        </FormLabel>
                        <FormDescription>
                          Enable users to end calls early
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="callDuration"
                  render={({ field }) => (
                    <FormItem className="rounded-lg border p-4">
                      <div className="space-y-0.5 flex flex-col">
                        <FormLabel className="text-base">
                          Call Duration Limit
                        </FormLabel>
                        <FormDescription>
                          Limit the duration of calls
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Slider
                          min={1}
                          max={120}
                          step={1}
                          value={[field.value ?? 0]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription className="text-right">
                        {field.value} minutes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="callTransfer"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 mr-4" />
                          <div>
                            <h3 className="font-medium">Call Transfer</h3>
                            <p className="text-sm text-muted-foreground">
                              Transfer calls to human agents
                            </p>
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sendMessage"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <MessageSquare className="h-5 w-5 mr-4" />
                          <div>
                            <h3 className="font-medium">Send Message</h3>
                            <p className="text-sm text-muted-foreground">
                              Send automated messages to users
                            </p>
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="realTimeBooking"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <Brain className="h-5 w-5 mr-4" />
                          <div>
                            <h3 className="font-medium">Real-time Booking</h3>
                            <p className="text-sm text-muted-foreground">
                              Schedule appointments and bookings
                            </p>
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-end p-2 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/ai-agents/page/1")}
            >
              Cancel
            </Button>
            <Button className="bg-primary text-white mb-5" type="submit">
              {form.formState.isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default EditDefaultAgent;
