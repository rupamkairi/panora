import { useCallback, useEffect, useState } from "react";
import { ScrollView, XStack, YStack } from "tamagui";

import {
  Button,
  FilePicker,
  Heading,
  Input,
  Label,
  Page,
  Progress,
  ProgressIndicator,
  Text,
} from "~/interface/components";

import { MAX_DOCUMENT_BYTES, type KnowledgeDocument } from "../types";

import type { PickedFile } from "~/interface/components";

type AuthState = "loading" | "signed-out" | "signed-in";
type FormState =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "error"; message: string };

const formatBytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export function AdminPanel() {
  const [auth, setAuth] = useState<AuthState>("loading");
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [state, setState] = useState<FormState>({ kind: "idle" });
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [organization, setOrganization] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  const loadDocuments = useCallback(async () => {
    const response = await fetch("/api/admin/documents");
    if (response.status === 401) {
      setAuth("signed-out");
      return;
    }
    const body = (await response.json()) as { documents: KnowledgeDocument[] };
    setDocuments(body.documents);
    setAuth("signed-in");
  }, []);

  useEffect(() => {
    void fetch("/api/admin/session").then(async (response) => {
      const body = (await response.json()) as { authenticated: boolean };
      if (body.authenticated) void loadDocuments();
      else setAuth("signed-out");
    });
  }, [loadDocuments]);

  useEffect(() => {
    if (auth !== "signed-in") return;
    const hasActive = documents.some((document) =>
      ["uploaded", "processing"].includes(document.status),
    );
    if (!hasActive) return;
    const timer = setInterval(() => void loadDocuments(), 1_500);
    return () => clearInterval(timer);
  }, [auth, documents, loadDocuments]);

  const signIn = async () => {
    setState({ kind: "busy" });
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      setState({
        kind: "error",
        message: "The username or password is incorrect.",
      });
      return;
    }
    setPassword("");
    setState({ kind: "idle" });
    await loadDocuments();
  };

  const upload = async () => {
    const picked = files[0];
    if (!picked?.file) {
      setState({ kind: "error", message: "Choose a file before uploading." });
      return;
    }
    setState({ kind: "busy" });
    const data = new FormData();
    data.set("file", picked.file);
    data.set("title", title || picked.name.replace(/\.[^.]+$/, ""));
    for (const [key, value] of Object.entries({
      description,
      author,
      organization,
      sourceUrl,
      publicationDate,
      language,
      category,
      tags,
    })) {
      if (value.trim()) data.set(key, value.trim());
    }
    const response = await fetch("/api/admin/documents", {
      method: "POST",
      body: data,
    });
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    if (!response.ok) {
      setState({
        kind: "error",
        message: body?.error ?? "The document could not be uploaded.",
      });
      return;
    }
    setFiles([]);
    setTitle("");
    setDescription("");
    setAuthor("");
    setOrganization("");
    setSourceUrl("");
    setPublicationDate("");
    setLanguage("");
    setCategory("");
    setTags("");
    setState({ kind: "idle" });
    await loadDocuments();
  };

  const documentAction = async (id: string, method: "POST" | "DELETE") => {
    setState({ kind: "busy" });
    const response = await fetch(`/api/admin/documents/${id}`, { method });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setState({
        kind: "error",
        message: body?.error ?? "The action could not be completed.",
      });
      return;
    }
    setState({ kind: "idle" });
    await loadDocuments();
  };

  if (auth === "loading")
    return (
      <Page justify="center" items="center">
        <Text>Loading admin panel…</Text>
      </Page>
    );
  if (auth === "signed-out") {
    return (
      <Page
        justify="center"
        items="center"
        px="$4"
        $platform-web={{ minHeight: "100vh" }}
      >
        <YStack width="100%" maxW={380} gap="$5">
          <YStack gap="$1">
            <Heading level="h3">Document administration</Heading>
            <Text tone="secondary">
              Sign in with the credentials configured on the server.
            </Text>
          </YStack>
          <YStack gap="$3">
            <YStack gap="$1">
              <Label htmlFor="admin-username">Username</Label>
              <Input
                id="admin-username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </YStack>
            <YStack gap="$1">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onSubmitEditing={signIn}
              />
            </YStack>
            {state.kind === "error" ? (
              <Text tone="destructive">{state.message}</Text>
            ) : null}
            <Button disabled={state.kind === "busy"} onPress={signIn}>
              {state.kind === "busy" ? "Signing in…" : "Sign in"}
            </Button>
          </YStack>
        </YStack>
      </Page>
    );
  }

  return (
    <Page $platform-web={{ minHeight: "100vh" }}>
      <ScrollView contentContainerStyle={{ pb: "$6" }}>
        <YStack width="100%" maxW={920} self="center" px="$4" py="$6" gap="$6">
          <XStack justify="space-between" items="center" gap="$3">
            <YStack gap="$1">
              <Heading level="h3">Knowledge library</Heading>
              <Text tone="secondary">
                Upload sources and follow their indexing progress.
              </Text>
            </YStack>
            <Button
              variant="ghost"
              onPress={() =>
                void fetch("/api/admin/session", { method: "DELETE" }).then(
                  () => setAuth("signed-out"),
                )
              }
            >
              Sign out
            </Button>
          </XStack>

          <YStack gap="$4" p="$4" bg="$surface" rounded="$4">
            <YStack gap="$1">
              <Heading level="h5">Add a document</Heading>
              <Text tone="secondary">
                PDF, DOCX, TXT, or Markdown · maximum 25 MB
              </Text>
            </YStack>
            <FilePicker
              files={files}
              onFilesChange={(next) => {
                setFiles(next);
                if (next[0] && !title)
                  setTitle(next[0].name.replace(/\.[^.]+$/, ""));
              }}
              accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
              maxFileSize={MAX_DOCUMENT_BYTES}
            />
            <YStack gap="$1">
              <Label htmlFor="document-title">Display title</Label>
              <Input
                id="document-title"
                value={title}
                onChangeText={setTitle}
              />
            </YStack>
            <YStack gap="$1">
              <Label htmlFor="document-description">
                Description (optional)
              </Label>
              <Input
                id="document-description"
                value={description}
                onChangeText={setDescription}
              />
            </YStack>
            <XStack gap="$3" flexWrap="wrap">
              <YStack gap="$1" flex={1} minW={220}>
                <Label htmlFor="document-author">Author (optional)</Label>
                <Input
                  id="document-author"
                  value={author}
                  onChangeText={setAuthor}
                />
              </YStack>
              <YStack gap="$1" flex={1} minW={220}>
                <Label htmlFor="document-organization">
                  Organization (optional)
                </Label>
                <Input
                  id="document-organization"
                  value={organization}
                  onChangeText={setOrganization}
                />
              </YStack>
            </XStack>
            <XStack gap="$3" flexWrap="wrap">
              <YStack gap="$1" flex={1} minW={220}>
                <Label htmlFor="document-category">Category (optional)</Label>
                <Input
                  id="document-category"
                  value={category}
                  onChangeText={setCategory}
                />
              </YStack>
              <YStack gap="$1" flex={1} minW={220}>
                <Label htmlFor="document-language">Language (optional)</Label>
                <Input
                  id="document-language"
                  value={language}
                  onChangeText={setLanguage}
                />
              </YStack>
            </XStack>
            <YStack gap="$1">
              <Label htmlFor="document-tags">
                Tags (optional, comma-separated)
              </Label>
              <Input id="document-tags" value={tags} onChangeText={setTags} />
            </YStack>
            <YStack gap="$1">
              <Label htmlFor="document-source-url">Source URL (optional)</Label>
              <Input
                id="document-source-url"
                value={sourceUrl}
                onChangeText={setSourceUrl}
                keyboardType="url"
                autoCapitalize="none"
              />
            </YStack>
            <YStack gap="$1">
              <Label htmlFor="document-publication-date">
                Original publication date (optional)
              </Label>
              <Input
                id="document-publication-date"
                value={publicationDate}
                onChangeText={setPublicationDate}
                placeholder="YYYY-MM-DD"
              />
            </YStack>
            {state.kind === "error" ? (
              <Text tone="destructive">{state.message}</Text>
            ) : null}
            <Button
              self="flex-start"
              disabled={!files.length || !title.trim() || state.kind === "busy"}
              onPress={upload}
            >
              {state.kind === "busy" ? "Working…" : "Upload and index"}
            </Button>
          </YStack>

          <YStack gap="$3">
            <Heading level="h5">Documents</Heading>
            {!documents.length ? (
              <Text tone="secondary">No documents have been uploaded.</Text>
            ) : (
              documents.map((document) => (
                <YStack
                  key={document.id}
                  py="$3"
                  borderBottomWidth={1}
                  borderColor="$outlineVariant"
                  gap="$2"
                >
                  <XStack justify="space-between" gap="$3" items="flex-start">
                    <YStack flex={1} gap="$1">
                      <Text weight="semibold">{document.title}</Text>
                      <Text tone="secondary">
                        {document.originalFilename} ·{" "}
                        {formatBytes(document.sizeBytes)} ·{" "}
                        {formatDate(document.uploadedAt)} · uploaded by{" "}
                        {document.uploadedBy}
                      </Text>
                    </YStack>
                    <Text weight="semibold">
                      {document.status === "processing"
                        ? `${document.phase} · ${document.progress}%`
                        : document.status}
                    </Text>
                  </XStack>
                  {document.status === "processing" ||
                  document.status === "uploaded" ? (
                    <YStack gap="$1">
                      <Progress
                        value={document.progress}
                        max={100}
                        aria-label={`Indexing ${document.title}: ${document.progress}% complete`}
                      >
                        <ProgressIndicator />
                      </Progress>
                      {document.totalChunks ? (
                        <Text size="xs" tone="secondary">
                          {document.processedChunks} of {document.totalChunks}{" "}
                          chunks
                        </Text>
                      ) : null}
                    </YStack>
                  ) : null}
                  {document.errorMessage ? (
                    <Text tone="destructive">{document.errorMessage}</Text>
                  ) : null}
                  <XStack gap="$2">
                    {document.status === "failed" ? (
                      <Button
                        uiSize="sm"
                        variant="secondary"
                        onPress={() => void documentAction(document.id, "POST")}
                      >
                        Retry indexing
                      </Button>
                    ) : null}
                    <Button
                      uiSize="sm"
                      variant="ghost"
                      onPress={() => void documentAction(document.id, "DELETE")}
                    >
                      Delete
                    </Button>
                  </XStack>
                </YStack>
              ))
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </Page>
  );
}
