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
  BotIcon,
} from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import countryCode from "@/utils/countryCode.json";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";
import "flag-icons/css/flag-icons.min.css";
import { useEffect, useState } from "react";
import henceforthApi from "@/utils/henceforthApis";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useGlobalContext } from "@/app/providers/Provider";
import { MultiSelect } from "@/components/common/MultiSelect";

// Zod schema for form validation
const formSchema = z.object({
  countryCode: z.string().min(1, "Please select a country code"),
  phoneNumber: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  knowledgeBase: z.array(z.string()),
  voice: z.string().min(1, "Please select a voice"),
  systemPrompt: z
    .string()
    .min(5, "System prompt must be at least 5 characters"),

  firstMessage: z
    .string()
    .min(5, "First message must be at least 5 characters"),
  ai_model: z.string().min(1, "Please select an AI model"),
});

const PhoneNumberSubmission = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      countryCode: "+91",
      phoneNumber: "",
      knowledgeBase: [],
    },
  });
  const [knowledgeBaseOptions, setKnowledgeBaseOptions] = useState<any>([]);
  const { userInfo, Toast } = useGlobalContext();
  const knowledgeBasesforSelection = knowledgeBaseOptions?.map(
    (option: any) => ({
      value: option?._id,
      label: option?.name,
      icon: LibraryBig,
    })
  );
  const [defaultKnowledgeBase, setDefaultKnowledgeBase] = useState<any>([]);

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

  const [kbLoading, setKbLoading] = useState(true);

  useEffect(() => {
    const getFormData = async () => {
      try {
        const apiRes = await henceforthApi.SuperAdmin.defaultCallData();
        console.log(apiRes, "apiRes?.data");

        await setDefaultKnowledgeBase(
          apiRes?.knowledge_base_id?.map((option: any) => option)
        );
        form.reset({
          ...form.getValues(),
          voice: apiRes?.voice,
          systemPrompt: apiRes?.call_prompt || "",
          firstMessage: apiRes?.call_first_message || "",
          ai_model: apiRes?.ai_model || "gemini",
        });
        setKbLoading(false);
      } catch (error) {}
    };
    getFormData();
  }, []);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Your API submission logic here

      if (defaultKnowledgeBase?.length === 0) {
        return Toast.error("Please select a knowledge base");
      }
      console.log(values);
      const payload = {
        phone_no: `${values.countryCode + values.phoneNumber}`,
        knowledge_base_id: defaultKnowledgeBase,
        secret_key: userInfo?.workspace?.key,
        voice: values.voice,
        prompt: values.systemPrompt,
        call_first_message: values.firstMessage,
        call_prompt: values.systemPrompt,
        ai_model: values.ai_model,
        first_message: values.firstMessage,
      };

      const apiRes = await henceforthApi.SuperAdmin.callTesting(payload);

      Toast.success("Phone number submitted successfully");
    } catch (error: any) {
      Toast.error(
        error?.response?.body?.message || "Failed to submit phone number"
      );
    }
  };

  return (
    <PageContainer>
      <div
        className={cn(
          "animate-in fade-in-50 duration-500 col-span-12",
          "slide-in-from-bottom-5"
        )}
      >
        <div className="">
          <div className="grid ">
            {/* Main Form */}
            <div className="">
              <Card className="">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-secondary rounded-lg">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Call Configuration</CardTitle>
                      <CardDescription>Set up your phone call</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] ">
                        {/* Country Code */}
                        <FormField
                          control={form.control}
                          name="countryCode"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Country code</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn(
                                        "w-[120px] justify-between",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        <>
                                          <span
                                            className={
                                              countryCode.find(
                                                (country: any) =>
                                                  country?.dial_code ===
                                                  field.value
                                              )?.flagClass + " me-2"
                                            }
                                          ></span>
                                          {
                                            countryCode.find(
                                              (country: any) =>
                                                country?.dial_code ===
                                                field.value
                                            )?.dial_code
                                          }
                                        </>
                                      ) : (
                                        "Select country code"
                                      )}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[240px] p-0">
                                  <Command>
                                    <CommandInput placeholder="Search country code..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        No country code found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        <ScrollArea className="h-56">
                                          {countryCode?.map((country: any) => (
                                            <CommandItem
                                              value={country?.dial_code}
                                              key={country?.dial_code}
                                              onSelect={() => {
                                                form.setValue(
                                                  "countryCode",
                                                  country?.dial_code
                                                );
                                              }}
                                            >
                                              <span
                                                className={
                                                  country?.flagClass + " me-2"
                                                }
                                              ></span>
                                              <span>
                                                {country?.name?.length > 12
                                                  ? country?.name?.slice(
                                                      0,
                                                      12
                                                    ) + "..."
                                                  : country?.name}
                                              </span>
                                              ({country.dial_code})
                                              <Check
                                                className={cn(
                                                  "ml-auto",
                                                  country.dial_code ===
                                                    field.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                )}
                                              />
                                            </CommandItem>
                                          ))}
                                        </ScrollArea>
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Phone Number */}
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex flex-col">
                                Phone Number
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter phone number"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Knowledge Base */}
                      {!kbLoading ? (
                        <FormField
                          name="knowledgeBase"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <LibraryBig className="h-4 w-4" />
                                Knowledge Base
                              </FormLabel>

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
                      ) : (
                        <span className="text-sm font-semibold">
                          Loading Knowledge Bases...
                        </span>
                      )}
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
                                <SelectItem value="deepseek">
                                  DeepSeek
                                </SelectItem>
                                <SelectItem value="claude">Claude</SelectItem>
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

                      {/* System Prompt */}
                      <FormField
                        control={form.control}
                        name="systemPrompt"
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
                        name="firstMessage"
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
                        className="w-full h-12 "
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
