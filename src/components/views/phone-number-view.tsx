"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Check,
  ChevronsUpDown,
  PhoneCall,
  Plus,
  Trash,
  Trash2,
} from "lucide-react";
import { cn } from "../../lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import countryCode from "../../utils/countryCode.json";
import { DataTable } from "../common/data-table";
import "flag-icons/css/flag-icons.min.css";
import henceforthApi from "../../utils/henceforthApis";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useGlobalContext } from "../../app/providers/Provider";
import { FaTrashCan } from "react-icons/fa6";
import PaginationCompo from "../common/Pagination";

const phoneNumberFormSchema = z.object({
  twilioSid: z.string().min(1, "Twilio SID is required"),
  authToken: z.string().min(1, "Auth Token is required"),
  countryCode: z.string().min(1, "Country code is required"),
  countryName: z.string().min(1, "Country is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export function PhoneNumberView() {
  const [phoneNumberListing, setPhoneNumberListing] = useState<any>({
    data: [],
    count: 0,
  });

  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { Toast } = useGlobalContext();
  const router = useRouter();
  const form = useForm<z.infer<typeof phoneNumberFormSchema>>({
    resolver: zodResolver(phoneNumberFormSchema),
    defaultValues: {
      twilioSid: "",
      authToken: "",
      countryCode: "+91",
      countryName: "India",
      phoneNumber: "",
    },
  });

  const handlePageChange = (page: number) => {
    const query = new URLSearchParams(searchParams?.toString());
    // query.set("limit", "10");

    router.replace(
      `/settings/phone-settings/page/${page}?${query.toString()}`,
      { scroll: false }
    );
  };

  useEffect(() => {
    // Set default country to India
    const indiaCountry = countryCode.find(
      (country) => country.dial_code === "+91"
    );
    if (indiaCountry) {
      setSelectedCountry(indiaCountry);
      form.setValue("countryCode", "+91");
      form.setValue("countryName", "India");
    }
  }, []);

  const params = useSearchParams();
  const searchParams = useSearchParams();
  const handleDelete = async (id: string) => {
    try {
      await henceforthApi.SuperAdmin.getTwilioNumbers();
      Toast.success("Phone number deleted successfully");
      await getPhoneNumberListing();
    } catch (error) {
      Toast.error(error);
    }
  };
  const getPhoneNumberListing = async () => {
    setIsLoading(true);
    try {
      let urlSearchParam = new URLSearchParams();

      if (params.get("pagination")) {
        urlSearchParam.set(
          "pagination",
          String(Number(params.get("pagination")) - 1)
        );
      }
      if (params.get("search")) {
        urlSearchParam.set("search", String(params.get("search")));
      }

      urlSearchParam.set("limit", "10");

      const apiRes = await henceforthApi.SuperAdmin.getPhoneNumbers(
        urlSearchParam.toString()
      );
      console.log(apiRes);
      setPhoneNumberListing({
        data: apiRes,
        count: apiRes?.length,
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPhoneNumberListing();
  }, []);

  const onSubmit = async (values: z.infer<typeof phoneNumberFormSchema>) => {
    console.log(values);

    try {
      const payload = {
        phone_number: `${values.countryCode}${values.phoneNumber}`,
        account_sid: values.twilioSid,
        auth_token: values.authToken,
        country: values.countryName,
      };

      const apiRes = await henceforthApi.SuperAdmin.addTwilioNumber(payload);
      Toast.success("Phone number added successfully");
      await getPhoneNumberListing();
      console.log(apiRes);
    } catch (error) {
      Toast.error(error);
    } finally {
      setOpen(false);
      form.reset();
    }
  };

  const columns = [
    {
      header: "Sr. No.",
      cell: ({ row }: { row: any }) => {
        const currentPage = Number(params.get("pagination")) || 1;
        const pageSize = Number(searchParams.get("limit")) || 10;
        return Number((currentPage - 1) * pageSize + (row.index + 1));
      },
    },
    {
      header: "Phone Number",
      accessorKey: "phone_number",
    },
    {
      header: "Twilio SID",
      accessorKey: "account_sid",
      cell: ({ getValue }: any) => (
        <div>
          <Tooltip>
            <TooltipTrigger>
              <span>
                {`${getValue("account_sid")?.slice(0, 4)}...${getValue(
                  "account_sid"
                )?.slice(-4)}`}
              </span>
            </TooltipTrigger>
            <TooltipContent align="center" sideOffset={-50}>
              <span>{getValue("account_sid")}</span>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
    {
      header: "Auth Token",
      accessorKey: "auth_token",
      cell: ({ getValue }: any) => (
        <div>
          <Tooltip>
            <TooltipTrigger>
              <span>
                {`${getValue("auth_token")?.slice(0, 4)}...${getValue(
                  "auth_token"
                )?.slice(-4)}`}
              </span>
            </TooltipTrigger>
            <TooltipContent align="center" sideOffset={-50}>
              <span>{getValue("auth_token")}</span>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
    {
      header: "Country",
      accessorKey: "country",
    },
    {
      header: "Created on",
      accessorKey: "created_at",
      cell: ({ row }: { row: any }) => (
        <span>{dayjs(row?.original?.created_at).format("DD MMM YYYY")}</span>
      ),
    },

    {
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <FaTrashCan
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(row.original._id);
          }}
          className="text-destructive cursor-pointer h-5 ml-4 w-5"
        />
      ),
    },
  ];

  const skeletonColumns = columns.map((column: any) => ({
    ...column,
    cell: () => <Skeleton className="h-6 w-full" />,
  }));
  return (
    <div className="grid grid-cols-1">
      <div
        className={cn(
          "animate-in fade-in-50 duration-500",
          "slide-in-from-bottom-5"
        )}
      >
        <Card className="col-span-12">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">Phone Settings</CardTitle>
                </div>
                <CardDescription>
                  Manage and monitor your phone numbers efficiently.
                </CardDescription>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Phone Number
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add Phone Number</DialogTitle>
                    <DialogDescription>
                      Add your Twilio phone number details below.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="twilioSid"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twilio SID</FormLabel>
                            <FormControl>
                              <Input
                                maxLength={34}
                                {...field}
                                placeholder="AC......."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="authToken"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Auth Token</FormLabel>
                            <FormControl>
                              <Input
                                maxLength={34}
                                type="password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 md:grid-cols-[130px_1fr] gap-4">
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
                                        "w-full justify-between",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value && selectedCountry ? (
                                        <>
                                          <span
                                            className={
                                              selectedCountry.flagClass +
                                              " mr-2"
                                            }
                                          ></span>
                                          {field.value}
                                        </>
                                      ) : (
                                        "Select code"
                                      )}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[320px] p-0">
                                  <Command>
                                    <CommandInput
                                      placeholder="Search country code..."
                                      className="h-9"
                                    />
                                    <CommandList>
                                      <CommandEmpty>
                                        No country code found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        <ScrollArea className="h-72">
                                          {countryCode?.map((country: any) => (
                                            <CommandItem
                                              key={country?.dial_code}
                                              value={`${country?.name} ${country?.dial_code}`}
                                              onSelect={() => {
                                                form.setValue(
                                                  "countryCode",
                                                  country?.dial_code
                                                );
                                                form.setValue(
                                                  "countryName",
                                                  country?.name
                                                );
                                                setSelectedCountry(country);
                                              }}
                                            >
                                              <span
                                                className={
                                                  country?.flagClass + " mr-2"
                                                }
                                              ></span>
                                              <span>{country?.name}</span>
                                              <span className="text-muted-foreground ml-auto">
                                                {country.dial_code}
                                              </span>
                                              <Check
                                                className={cn(
                                                  "ml-2",
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
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem className="relative -top-[10px]">
                              <FormLabel>Phone Number</FormLabel>
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
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Add Number</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mx-auto">
              {isLoading ? (
                <div className="mx-auto">
                  <DataTable
                    columns={skeletonColumns}
                    data={Array.from({ length: 8 }, (_, index) => ({ index }))}
                    totalItems={8}
                  />
                </div>
              ) : (
                <>
                  <DataTable
                    columns={columns}
                    data={phoneNumberListing?.data}
                    totalItems={phoneNumberListing?.count}
                  />
                  <PaginationCompo
                    currentPage={Number(params.get("pagination")) || 1}
                    itemsPerPage={Number(searchParams.get("limit")) || 10}
                    totalDataCount={phoneNumberListing?.count}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
