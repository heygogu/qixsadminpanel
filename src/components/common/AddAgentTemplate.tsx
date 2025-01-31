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
// import DashboardLayout from "@/app/dashboard/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import placeholder from "@/assets/images/userplaceholder.png";
// import PageContainer from "@/components/layout/page-container";
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
import { MultiSelect } from "@/components/common/MultiSelect";
import { useGlobalContext } from "@/app/providers/Provider";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  // image: z.string().url("Please enter a valid URL").optional(),
  voice: z.string().optional(),
  phone: z.string().optional(),
  model: z.string(),
  knowledgeBase: z.array(z.string()).optional(),
  idleReminder: z.boolean(),
  callDuration: z.number().min(1).max(120),
  allowCallCut: z.boolean(),
  callTransfer: z.boolean(),
  sendMessage: z.boolean(),
  realTimeBooking: z.boolean(),
  chat_prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  chat_firstMessage: z
    .string()
    .min(10, "First message must be at least 10 characters"),
  call_prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  call_firstMessage: z
    .string()
    .min(10, "First message must be at least 10 characters"),
});

function AddTemplate() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idleReminder: true,
      callDuration: 30,
      allowCallCut: true,
      callTransfer: true,
      sendMessage: true,
      realTimeBooking: true,
      voice: "aura-zeus-en",
      model: "gemini",
    },
  });
  const router = useRouter();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { userInfo } = useGlobalContext();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [photoString, setPhotoString] = useState<string | null>(
    userInfo?.workspace?.workspace_id?.image
  );
  const [knowledgeBaseOptions, setKnowledgeBaseOptions] = useState<any>([]);

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

  const knowledgeBasesforSelection = knowledgeBaseOptions?.map(
    (option: any) => ({
      value: option?._id,
      label: option?.name,
      icon: LibraryBig,
    })
  );
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, "formvalues");

    const payload = {
      name: values.name,
      type: "Agent",
      voice: values.voice,
      image: photoString,
      chat_first_message: values.chat_firstMessage,
      chat_prompt: values.chat_prompt,
      call_first_message: values.call_firstMessage,
      call_prompt: values.call_prompt,
      phone_no: values.phone,
      country_code: "+91",
      knowledge_base_id: values.knowledgeBase,
      ai_model: values.model,
      idle_reminder: values.idleReminder,
      call_cut_ability: values.allowCallCut,
      call_limit_duration: values.callDuration,
      call_transfer: values.callTransfer,
      send_message: values.sendMessage,
      real_time_booking: values.realTimeBooking,
    };

    try {
      const apiRes = await henceforthApi.SuperAdmin.addAgentTemplate(payload);
      toast.success("Agent created successfully");
    } catch (error) {
    } finally {
      router.push("/ai-agents/page/1");
    }
  }

  useEffect(() => {
    const getKnowledgeBaseOptions = async () => {
      try {
        const apiRes = await henceforthApi.SuperAdmin.getKnowledgeBases();
        console.log(apiRes?.data, "apiRes?.data");
        setKnowledgeBaseOptions(apiRes?.data);
      } catch (error) {}
    };
    getKnowledgeBaseOptions();
  }, []);
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Create Agent</h2>
        <p className="text-muted-foreground">
          Build a custom AI agent with complete control over its capabilities,
          personality, and behavior
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
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
                      {logoPreview ? (
                        <AvatarImage
                          src={logoPreview}
                          alt="Agent Image"
                          className="object-cover h-full w-full"
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

                {/* <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Agent Image URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter image URL" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}

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
                            {/* <SelectItem value="perplexity">Perplexity</SelectItem>
                                                        <SelectItem value="claude">Claude</SelectItem> */}
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
                        {/* <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select knowledge base" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-white">
                                                        {/* <SelectItem value="general">General Knowledge</SelectItem>
                                                        <SelectItem value="customer">Customer Service</SelectItem>
                                                        <SelectItem value="technical">Technical Support</SelectItem> */}
                        {/* {knowledgeBaseOptions?.length>0? knowledgeBaseOptions?.map((option:any)=>(
                                                            <SelectItem key={option?._id} value={option?._id}>{option?.name}</SelectItem>
                                                        )): <SelectItem value="nodata" disabled>No knowledge base available</SelectItem>}
                                                    </SelectContent> 
                                                </Select> */}
                        <MultiSelect
                          options={knowledgeBasesforSelection}
                          onValueChange={field.onChange}
                          defaultValue={field.value || []}
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
              <Separator className="  text-gray-500" />
              <CardHeader>
                <CardTitle className="">Call Configuration</CardTitle>
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
                          placeholder="Enter the first message the agent will say..."
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
            {/* <Card>
                            <CardHeader>Call Prompt Configuration</CardHeader>
                        </Card> */}
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1234567890" {...field} />
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
                    <FormItem className=" rounded-lg border p-4">
                      <div className="space-y-0.5 flex flex-col">
                        <FormLabel className="text-base">
                          Call Duration Limit
                        </FormLabel>
                        <FormDescription>
                          Limit the duration of calls
                        </FormDescription>
                        {/* <FormLabel>Call Duration Limit (minutes)</FormLabel> */}
                      </div>
                      <FormControl>
                        <Slider
                          min={1}
                          max={120}
                          step={1}
                          value={[field.value]}
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

          <div className="mt-6 flex justify-end p-2 gap-4 ">
            {/* <Button variant="outline" className="text-red-400 border-red-200 bg-red-50" onClick={onCancel}>Cancel</Button> */}
            <Button className="bg-primary text-white mb-5" type="submit">
              Create Agent
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default AddTemplate;
