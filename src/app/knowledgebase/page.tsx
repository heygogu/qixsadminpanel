"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Upload,
  FileText,
  Link2,
  Loader2,
  Folder,
  Loader,
  Scroll,
  LibraryBig,
} from "lucide-react";
import {
  FaRegFilePdf,
  FaRegFileWord,
  FaRegFile,
  FaTrashCan,
} from "react-icons/fa6";
import { FiFileText } from "react-icons/fi";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <QuillLoader />,
});

import { ProgressWithValue } from "@/components/common/ProgressWithValue";

import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import henceforthApi from "@/utils/henceforthApis";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageContainer from "@/components/layouts/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import dayjs from "dayjs";
import PaginationCompo from "@/components/common/Pagination";
import { useParams, useRouter, useSearchParams } from "next/navigation";
interface KnowledgeBase {
  _id: number;
  name: string;
  created_at: string;
}

interface Document {
  _id: number;
  name: string;
  type: string;
  document_title: string;
  url: string;
  content: string;
  updated_at: string;
  created_at: string;
  knowledge_base_id: number;
  file?: File;
  source?: "upload" | "url" | "diy";
}
const QuillLoader = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

const PERCENTAGE = [0, 10, 15, 30, 45, 50, 65, 80, 90, 100];

const KnowledgeBaseManager = () => {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [selectedKB, setSelectedKB] = useState<KnowledgeBase | null>(null);
  const [documents, setDocuments] = useState<any>({
    data: [],
    count: 0,
  });
  const [showNewKBDialog, setShowNewKBDialog] = useState(false);
  const [newKBName, setNewKBName] = useState("");
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [showDIYDialog, setShowDIYDialog] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlTitle, setUrlTitle] = useState("");
  const [diyTitle, setDiyTitle] = useState("");
  const [diyContent, setDiyContent] = useState("");
  const [docsLoading, setDocsLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [radioButton, setRadioButton] = useState("1");
  const [value, setValue] = useState(0);
  const [scrappingStarted, setScrappingStarted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (scrappingStarted) {
      setValue(0); // Reset to 0 when scrapping starts

      timer = setInterval(() => {
        setValue((prev) => {
          const nextIndex = PERCENTAGE.indexOf(prev) + 1;
          if (nextIndex < PERCENTAGE.length - 1) {
            // Stop at 90% (second to last value)
            return PERCENTAGE[nextIndex];
          }
          return prev; // Stay at current value if at 90%
        });
      }, 1000);
    } else if (value > 0) {
      // Only set to 100 when scrappingStarted becomes false
      setValue(100);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [scrappingStarted]);

  useEffect(() => {
    fetchKnowledgeBases();
  }, []);

  const [isQuillLoading, setIsQuillLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsQuillLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const fetchKnowledgeBases = async () => {
    setFetching(true);
    try {
      const response = await henceforthApi.KB.getKnowledgeBases();
      setKnowledgeBases(response.data);
    } catch (err) {
      setError("Failed to fetch knowledge bases");
    } finally {
      setFetching(false);
    }
  };

  // const params = useParams()

  const router = useRouter();

  const handlePageChange = (page: number) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("page", page.toString()); // Use 1-based page number for the URL
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    router.push(newUrl, { scroll: false }); // Update URL without scrolling
  };
  const searchParams = useSearchParams();
  const fetchDocuments = async (kbId: number, page?: number) => {
    if (!kbId) return;
    setDocsLoading(true);
    try {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set("pagination", page?.toString() || ""); // Use 0-based index for the backend
      urlSearchParams.set("limit", "10");
      const response = await henceforthApi.KB.getDocuments(
        kbId,
        urlSearchParams
      );
      setDocuments({
        data: response.data,
        count: response.count,
      });
    } catch (err) {
      setError("Failed to fetch documents");
    } finally {
      setDocsLoading(false);
    }
  };
  useEffect(() => {
    if (selectedKB?._id !== undefined) {
      const queryParams = new URLSearchParams(window.location.search);
      const page = Number(queryParams.get("page")) || 1; // Get 1-based page from URL
      fetchDocuments(selectedKB._id, page - 1); // Convert to 0-based for the API call
    }
  }, [selectedKB, searchParams]); // Trigger when selectedKB or searchParams change

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const page = queryParams.get("page");
    if (!page || isNaN(Number(page)) || Number(page) < 1) {
      queryParams.set("page", "1"); // Default to page 1 if no page is specified or invalid
      const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
      router.push(newUrl, { scroll: false }); // Update URL without scrolling
    }
  }, []);

  const handleKBSelect = (kb: KnowledgeBase) => {
    setSelectedKB(kb);
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.set("page", "1");
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    router.push(newUrl);
    fetchDocuments(kb?._id);
  };

  const handleCreateKB = async () => {
    if (!newKBName.trim()) {
      setError("Knowledge base name is required");
      return;
    }
    try {
      await henceforthApi.KB.createKnowledgeBase({ name: newKBName });
      await fetchKnowledgeBases();
      setShowNewKBDialog(false);
      setNewKBName("");
      toast.success("Knowledge base created successfully");
    } catch (err) {
      setError("Failed to create knowledge base");
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    debugger;
    if (!selectedKB) {
      setError("Please select a knowledge base first");
      return;
    }

    const files = event.target.files ? Array.from(event.target.files) : [];
    const allowedTypes = [".pdf", ".txt", ".docx", ".csv", ".xsl"];

    const invalidFiles = files.filter(
      (file) =>
        !allowedTypes.some((type) => file.name.toLowerCase().endsWith(type))
    );

    if (invalidFiles.length > 0) {
      setError(
        `Invalid file type(s). Only PDF, CSV, DOCX and TXT files are allowed`
      );
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const file = files[0];
      let endpoint = "admin/knowledge-base/";

      if (file.name.toLowerCase().endsWith(".pdf")) {
        endpoint += "pdf-upload";
      } else if (file.name.toLowerCase().endsWith(".docx")) {
        endpoint += "pdf-upload";
      } else if (file.name.toLowerCase().endsWith(".txt")) {
        endpoint += "text-upload";
      } else if (file.name.toLowerCase().endsWith(".csv")) {
        endpoint += "pdf-upload";
      } else if (
        file.name.toLowerCase().endsWith(".xls") ||
        file.name.toLowerCase().endsWith(".xlsx")
      ) {
        endpoint += "pdf-upload";
      } else {
        setError("Unsupported file type");
        setIsLoading(false);
        return;
      }

      await henceforthApi.KB.post(endpoint, "file", file, {
        knowledge_base_id: selectedKB._id.toString(),
      });
      await fetchDocuments(selectedKB._id);
      toast.success("Document uploaded successfully");
      setShowUploadDialog(false);
    } catch (err) {
      setError("Failed to upload document");
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "pdf":
        return <FaRegFilePdf className="h-5 w-5 text-destructive" />;
      case "doc":
      case "docx":
        return <FaRegFileWord className="h-5 w-5 text-primary" />;
      case "txt":
        return <FiFileText className="h-5 w-5 text-primary" />;
      default:
        return <FaRegFile className="h-5 w-5 text-primary" />;
    }
  };

  const handleKBDelete = async (kb: KnowledgeBase) => {
    try {
      const apiRes = await henceforthApi.KB.deleteKnowledgeBase(kb._id);
      setSelectedKB(null);
      await fetchKnowledgeBases();
      setDocuments({
        data: [],
        count: 0,
      });
      toast.success("Knowledge base deleted successfully");
    } catch (error) {}
  };

  const handleDeleteDocument = async (doc: Document) => {
    setDocsLoading(true);
    try {
      const apiRes = await henceforthApi.KB.deleteKbDocuments(doc._id);
      await fetchDocuments(doc?.knowledge_base_id);
      toast.success("Document deleted successfully");
    } catch (error) {
    } finally {
      setDocsLoading(false);
    }
  };

  return (
    <PageContainer>
      <div
        className={cn(
          "animate-in fade-in-50 duration-500",
          "slide-in-from-bottom-5"
        )}
      >
        <Card className=" mb-10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <LibraryBig className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">
                Knowledge Base Management
              </CardTitle>
            </div>
            <CardDescription>
              Manage and monitor your Knowledge Bases
            </CardDescription>
            {error && (
              <Alert
                onMouseOver={() => setError("")}
                variant="destructive"
                className=" animate-in relative top-2 transition-all duration-300"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              {/* Knowledge Bases List */}

              <Card className=" shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg font-semibold">
                    Knowledge Bases ({knowledgeBases.length})
                  </CardTitle>
                  <Button
                    onClick={() => setShowNewKBDialog(true)}
                    className="bg-primary text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                </CardHeader>
                <ScrollArea className="h-[calc(100vh-42vh)] py-2">
                  <CardContent>
                    <div className="space-y-6">
                      {fetching
                        ? Array.from({ length: 6 }).map((_, index) => (
                            <div
                              className="flex items-center p-2 border rounded-lg w-full animate-pulse"
                              key={index}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="lightgrey"
                                stroke="currentColor"
                                stroke-width="0"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                              </svg>
                              <div className="w-full my-2">
                                <div className="h-2.5 w-96 mb-2 bg-secondary"></div>
                                <div className=" h-2 w-80 bg-secondary"></div>
                              </div>
                            </div>
                          ))
                        : knowledgeBases?.map((kb) => (
                            <div
                              key={kb?._id}
                              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors border  border-primary/50 ${
                                selectedKB?._id === kb?._id
                                  ? "bg-primary/5 border-dashed "
                                  : "hover:bg-primary/5"
                              }`}
                              onClick={() => handleKBSelect(kb)}
                            >
                              <Folder
                                // fill="bg-primary"
                                className="mr-3 h-8 w-8 text-primary"
                              />
                              <div className="flex-1">
                                <div className="font-medium">{kb.name}</div>
                                <div className="text-sm text-gray-500 mt-1s">
                                  Created on{" "}
                                  {dayjs(kb.created_at).format("DD MMM YYYY")}
                                </div>
                              </div>
                              <FaTrashCan
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleKBDelete(kb);
                                }}
                                className="text-destructive ml-4"
                              />
                            </div>
                          ))}
                    </div>
                  </CardContent>
                </ScrollArea>
              </Card>

              {/* Documents List */}
              {knowledgeBases.length > 0 && (
                <Card className="max-h-[calc(100vh-25vh)] overflow-y-auto shadow-none ">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-semibold">
                      {selectedKB
                        ? `Documents in ${selectedKB.name}`
                        : "Select a Knowledge Base"}
                    </CardTitle>
                    {selectedKB && (
                      <div className="flex space-x-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="">
                              <Plus className="mr-2 h-4 w-4" /> Add Document
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="center"
                            className="w-56 p-3 bg-white"
                          >
                            <DropdownMenuItem asChild>
                              <>
                                <label
                                  className="flex ms-2 mb-1 text-md items-center cursor-pointer"
                                  onClick={() =>
                                    document
                                      .getElementById("fileInput")
                                      ?.click()
                                  }
                                >
                                  <Upload className="mr-2 h-4 w-4" />{" "}
                                  <span className="text-[15px]">
                                    Upload File
                                  </span>
                                </label>
                                <Input
                                  id="fileInput"
                                  type="file"
                                  className="hidden"
                                  onChange={handleFileUpload}
                                  accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                                />
                              </>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => setShowDIYDialog(true)}
                            >
                              <FileText className="mr-2 h-4 w-4" /> Create
                              Document
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => setShowUrlDialog(true)}
                            >
                              <Link2 className="mr-2 h-4 w-4" /> Add from URL
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {/* <Button
                      onClick={handleTrain}
                      disabled={isLoading || documents?.length === 0}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        'Train'
                      )}
                    </Button> */}
                      </div>
                    )}
                  </CardHeader>
                  <ScrollArea className="h-[calc(100vh-42vh)]">
                    <CardContent>
                      <div className="space-y-4">
                        {docsLoading
                          ? Array.from({ length: 7 }).map((_, index) => (
                              <div
                                className="flex items-center  w-full border p-2 rounded-lg  animate-pulse"
                                key={index}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                  fill="lightgrey"
                                  stroke="currentColor"
                                  stroke-width="0"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                >
                                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                                </svg>
                                <div className="w-full my-2">
                                  <div className="h-2.5 w-96 mb-2 bg-secondary"></div>
                                  <div className=" h-2 w-80 bg-secondary"></div>
                                </div>
                              </div>
                            ))
                          : documents?.data?.map((doc: any) => (
                              <div
                                key={doc?._id}
                                className="flex items-center md:flex-row gap-1 md:items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  setShowDocumentDialog(true);
                                }}
                              >
                                {getFileIcon(doc?.type)}
                                <div className="ml-0 md:ml-3 flex-1 mt-2 md:mt-0">
                                  <div className="font-medium text-sm">
                                    {doc?.name}
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    Updated on{" "}
                                    {dayjs(doc?.updated_at).format(
                                      "DD MMM YYYY"
                                    )}
                                  </div>
                                </div>
                                <FaTrashCan
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDocument(doc);
                                  }}
                                  className="text-destructive mt-2 md:mt-0"
                                />
                              </div>
                            ))}
                        {documents?.data?.length === 0 && !docsLoading && (
                          <div className="text-center py-8 text-gray-500">
                            {selectedKB
                              ? "No documents in this knowledge base"
                              : "Select a knowledge base to view documents"}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </ScrollArea>
                </Card>
              )}
            </div>
          </CardContent>
          <div className="ml-0 lg:ml-[600px] mb-3 ">
            <PaginationCompo
              currentPage={Number(searchParams.get("page")) || 1} // Use 1-based page number for display
              itemsPerPage={10}
              totalDataCount={documents?.count}
              onPageChange={(page) => handlePageChange(page)} // Pass the 1-based page number
            />
          </div>
        </Card>
        <div>
          {/* <div>
          <h2 className="text-3xl font-bold">Knowledge Base Management</h2>
          <p className="text-muted-foreground">
            Manage and monitor your Knowledge Bases
          </p>
        </div> */}
        </div>

        {/* New Knowledge Base Dialog */}
        <Dialog open={showNewKBDialog} onOpenChange={setShowNewKBDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateKB();
              }}
            >
              <DialogHeader>
                <DialogTitle>Create New Knowledge Base</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={newKBName}
                    onChange={(e) => setNewKBName(e.target.value)}
                    placeholder="Enter knowledge base name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewKBDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="text-white">
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Document Content Dialog */}
        <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
          <DialogContent className="sm:max-w-7xl">
            <DialogHeader>
              <DialogTitle>{selectedDocument?.name}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[calc(100vh-20vh)]">
              <div className="mt-4 ">
                <div className="mr-3 ml-2">
                  <div
                    className="text-justify"
                    dangerouslySetInnerHTML={{
                      __html: selectedDocument?.content || "",
                    }}
                  />
                </div>
              </div>
            </ScrollArea>
            <Button
              className="ml-auto"
              onClick={() => setShowDocumentDialog(false)}
            >
              Close
            </Button>
          </DialogContent>
          <DialogFooter></DialogFooter>
        </Dialog>

        {/* URL Dialog */}
        <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Add from URL</DialogTitle>
            </DialogHeader>
            {scrappingStarted && (
              <div>
                <ProgressWithValue
                  key={"follow"}
                  value={value}
                  position={"follow"}
                />
              </div>
            )}
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium"> Title</label>
                <Input
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  placeholder="Enter document title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL</label>
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter URL"
                  type="url"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fetch Option</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="1"
                      checked={radioButton === "1"}
                      onChange={() => setRadioButton("1")}
                      className="form-radio"
                    />
                    <span>First Page</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="2"
                      checked={radioButton === "2"}
                      onChange={() => setRadioButton("2")}
                      className="form-radio"
                    />
                    <span>Whole Website</span>
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowUrlDialog(false);
                  setUrlTitle("");
                  setUrlInput("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!selectedKB) {
                    setError("Please select a knowledge base first");
                    return;
                  }
                  if (!urlTitle || !urlInput) {
                    setError("Title and URL are required");
                    return;
                  }

                  setIsLoading(true);
                  setScrappingStarted(true);
                  try {
                    await henceforthApi.KB.addUrlDocument({
                      url: urlInput,
                      title: urlTitle,
                      knowledge_base_id: selectedKB._id,
                      depth: Number(radioButton),
                    });
                    setScrappingStarted(false);
                    await fetchDocuments(selectedKB._id);
                    toast.success("Document added successfully");
                    setShowUrlDialog(false);
                    setUrlTitle("");
                    setUrlInput("");
                  } catch (err) {
                    setError("Failed to add document from URL");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Document"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DIY Dialog */}
        <Dialog open={showDIYDialog} onOpenChange={setShowDIYDialog}>
          <DialogContent className="max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Title</label>
                <Input
                  value={diyTitle}
                  onChange={(e) => setDiyTitle(e.target.value)}
                  placeholder="Enter document title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>

                {isQuillLoading ? (
                  <QuillLoader />
                ) : (
                  <ReactQuill
                    theme="snow"
                    value={diyContent}
                    onChange={setDiyContent}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ indent: "-1" }, { indent: "+1" }],
                        [{ color: [] }, { background: [] }],
                      ],
                    }}
                    placeholder="Enter document content..."
                    className="h-48 mb-16"
                  />
                )}
              </div>
            </div>
            <DialogFooter className="mt-8">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDIYDialog(false);
                  setDiyTitle("");
                  setDiyContent("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!selectedKB) {
                    setError("Please select a knowledge base first");
                    return;
                  }
                  if (!diyTitle || !diyContent) {
                    setError("Title and content are required");
                    return;
                  }

                  setIsLoading(true);
                  try {
                    await henceforthApi.KB.textUpload({
                      title: diyTitle,
                      text: diyContent,
                      knowledge_base_id: selectedKB._id,
                    });
                    await fetchDocuments(selectedKB._id);
                    toast.success("Document created successfully");
                    setShowDIYDialog(false);
                    setDiyTitle("");
                    setDiyContent("");
                  } catch (err) {
                    setError("Failed to create document");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Document"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <KnowledgeBaseManager />
    </DashboardLayout>
  );
}
