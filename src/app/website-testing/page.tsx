"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import {
  AlertCircle,
  Code2,
  Globe,
  Headphones,
  LibraryBig,
  Loader2,
  MessageCircle,
  Phone,
  Shield,
  Speaker,
  Sparkles,
  ChevronsUpDown,
  Check,
  Bot,
  BotIcon,
} from "lucide-react";

import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";
// import "flag-icons/css/flag-icons.min.css";
import { useEffect, useState } from "react";
import henceforthApi from "@/utils/henceforthApis";

import { useGlobalContext } from "@/app/providers/Provider";
import { MultiSelect } from "@/components/common/MultiSelect";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Zod schema for form validation
const formSchema = z.object({
  //   countryCode: z.string().min(1, "Please select a country code"),
  //   phoneNumber: z.string()
  //     .min(7, "Phone number must be at least 7 digits")
  //     .max(15, "Phone number must not exceed 15 digits")
  //     .regex(/^\d+$/, "Phone number must contain only digits"),
  //    knowledgeBase: z.array(z.string()),
  voice: z.string().min(1, "Please select a voice"),
  chat_first_message: z.string().min(1, "Please enter chat first message"),
  chat_prompt: z.string().min(1, "Please enter chat prompt"),
  call_prompt: z.string().min(1, "Please enter call prompt"),
  call_first_message: z.string().min(1, "Please enter call first message"),
  ai_model: z.string().min(1, "Please select an AI model"),
  knowledgeBaseForWebsite: z.array(z.string()),
});

const PhoneNumberSubmission = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //   knowledgeBase: [],
      // voice: "aura-zeus-en",

      knowledgeBaseForWebsite: [],
    },
  });
  const [knowledgeBaseOptions, setKnowledgeBaseOptions] = useState<any>([]);
  const knowledgeBasesforSelection = knowledgeBaseOptions?.map(
    (option: any) => ({
      value: option?._id,
      label: option?.name,
      icon: LibraryBig,
    })
  );
  const { Toast } = useGlobalContext();

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

  useEffect(() => {
    const getFormData = async () => {
      try {
        const apiRes = await henceforthApi.SuperAdmin.websiteTestingListing();
        console.log(apiRes?.data, "apiRes?.data");

        form.reset({
          voice: apiRes?.data?.voice,
          chat_first_message: apiRes?.data?.chat_first_message,
          chat_prompt: apiRes?.data?.chat_prompt,
          call_prompt: apiRes?.data?.call_prompt,
          call_first_message: apiRes?.data?.call_first_message,
          ai_model: apiRes?.data?.ai_model,
          knowledgeBaseForWebsite: apiRes?.data?.knowledgeBaseForWebsite || [],
        });
      } catch (error) {}
    };
    getFormData();
  }, []);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Your API submission logic here
      debugger;
      console.log(values);
      const payload = {
        // phone_no: `${values.countryCode + values.phoneNumber}`,
        // knowledge_base_id: values.knowledgeBase,
        knowledge_base_id_for_website: values.knowledgeBaseForWebsite,
        voice: values.voice,
        chat_first_message: values.chat_first_message,
        chat_prompt: values.chat_prompt,
        ai_model: values.ai_model,
        call_prompt: values.call_prompt,
        call_first_message: values.call_first_message,
      };

      const apiRes = await henceforthApi.SuperAdmin.websiteTesting(payload);

      Toast.success(" Submitted successfully");
    } catch (error: any) {
      Toast.error(error?.response?.body?.message || "Failed to submit");
    }
  };

  return (
    <PageContainer>
      <div
        className={cn(
          "animate-in fade-in-50 grid grid-cols-1 duration-500 ",
          "slide-in-from-bottom-5"
        )}
      >
        <div className="grid ">
          {/* Main Form */}
          <div className="col-span-12">
            <Card className="">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-secondary rounded-lg">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Website Testing</CardTitle>
                    <CardDescription>Set up your website</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mt-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="knowledgeBaseForWebsite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <LibraryBig className="h-4 w-4" />
                            Knowledge Base (Website)
                          </FormLabel>

                          <MultiSelect
                            options={knowledgeBasesforSelection}
                            onValueChange={field.onChange}
                            defaultValue={field.value || []}
                            placeholder="Select Knowledge Bases for Website"
                            variant="inverted"
                            animation={2}
                            maxCount={8}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/*AI Model*/}
                    <FormField
                      control={form.control}
                      name="ai_model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <BotIcon className="h-4 w-4" />
                            AI Model
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={
                                  !field.value ? "text-muted-foreground" : ""
                                }
                              >
                                <SelectValue placeholder="Select AI Model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="gemini">Gemini</SelectItem>
                              <SelectItem value="chatgpt">ChatGPT</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Voice Selection */}
                    <FormField
                      control={form.control}
                      name="voice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Speaker className="h-4 w-4" />
                            Voice Selection
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select voice" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                    <Separator className="text-gray-600" />
                    <CardTitle className="text-xl">
                      Chat Configuration
                    </CardTitle>
                    {/* System Prompt */}
                    <FormField
                      control={form.control}
                      name="chat_prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Code2 className="h-4 w-4" />
                            System Prompt
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter system prompt..."
                              className="min-h-[200px] p-5"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* First Message */}
                    <FormField
                      control={form.control}
                      name="chat_first_message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            First Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter first message..."
                              className="min-h-[200px] p-5"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="text-gray-600" />
                    <CardTitle className="text-xl">
                      Call Configuration
                    </CardTitle>
                    {/* System Prompt */}
                    <FormField
                      control={form.control}
                      name="call_prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Code2 className="h-4 w-4" />
                            System Prompt
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter system prompt..."
                              className="min-h-[200px] p-5"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* First Message */}
                    <FormField
                      control={form.control}
                      name="call_first_message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            First Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter first message..."
                              className="min-h-[200px] p-5"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-12 bg-primary"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin mr-2" />
                          Setting up...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2" />
                          Submit
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <PhoneNumberSubmission />
    </DashboardLayout>
  );
}
