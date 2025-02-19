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

import { Loader2, Sparkles, ChevronsUpDown, Check, User } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import countryCode from "@/utils/countryCode.json";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";
import "flag-icons/css/flag-icons.min.css";

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
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Zod schema for form validation
const formSchema = z.object({
  countryCode: z.string().min(1, "Please select a country code"),
  phoneNumber: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

const PhoneNumberSubmission = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      countryCode: "+91",
      phoneNumber: "",
    },
  });

  const { userInfo, Toast } = useGlobalContext();
  const [callAgent, setCallAgent] = useState<any>();

  useEffect(() => {
    async function getCallAgent() {
      try {
        const res = await henceforthApi.SuperAdmin.getCallAgentData();
        console.log(res);
        setCallAgent(res?.data);
      } catch (error) {}
    }

    getCallAgent();
  }, []);
  // const [kbLoading, setKbLoading] = useState(true);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Your API submission logic here

      console.log(values);
      const payload = {
        phone_no: `${values.countryCode + values.phoneNumber}`,
        secret_key: userInfo?.workspace?.key,
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
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
            {/* Main Form */}
            <div className="">
              <Card className="">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-secondary rounded-lg">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Call Testing</CardTitle>
                      <CardDescription>Set up your phone call</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <div className="space-y-4 mb-16">
                      {/* show agent photo and agent name using sahdcn avatar and cenetered */}
                      <div className="flex flex-col items-center space-y-2">
                        <Avatar className="w-32 h-32">
                          {callAgent?.image ? (
                            <AvatarImage
                              className="object-cover w-full h-full rounded-full"
                              src={henceforthApi?.FILES?.imageOriginal(
                                callAgent?.image
                              )}
                              alt={callAgent?.name}
                            />
                          ) : (
                            <AvatarFallback className="text-2xl">
                              <User size={50} />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="text-lg font-bold">
                          {callAgent?.name}
                        </div>
                      </div>
                    </div>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] sm:grid-cols-1 ">
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
