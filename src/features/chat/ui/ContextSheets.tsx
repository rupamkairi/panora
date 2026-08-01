import { useEffect, useMemo, useState } from "react";
import { Pressable as NativePressable } from "react-native";
import { ScrollView, XStack, YStack, useTheme } from "tamagui";

import { reportRepository } from "~/features/reports/repository";
import type { ReportSummary } from "~/features/reports/types";
import {
  AppSheet,
  Button,
  IconButton,
  Input,
  Text,
} from "~/interface/components";
import { CheckIcon, CloseIcon, SearchIcon } from "~/interface/icons/ChatIcons";

import type { ChatContextItem } from "../types";

type ContextSheetsProps = {
  reportsOpen: boolean;
  onReportsOpenChange: (open: boolean) => void;
  selected: ChatContextItem[];
  onAdd: (items: ChatContextItem[]) => void;
};

export function ContextSheets(props: ContextSheetsProps) {
  return <ReportSheet {...props} />;
}

function ReportSheet({
  reportsOpen,
  onReportsOpenChange,
  selected,
  onAdd,
}: ContextSheetsProps) {
  const [query, setQuery] = useState("");
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [pending, setPending] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    if (!reportsOpen) return;
    setLoading(true);
    setLoadError(false);
    void reportRepository
      .list({ search: query })
      .then(setReports)
      .catch(() => {
        setReports([]);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }, [query, reloadKey, reportsOpen]);

  useEffect(() => {
    if (reportsOpen) {
      setPending(
        selected
          .filter((item) => item.kind === "report")
          .map((item) => item.reportId),
      );
    }
  }, [reportsOpen, selected]);

  const selectedNonReports = selected.filter(
    (item) => item.kind !== "report",
  ).length;
  const maxReports = 5 - selectedNonReports;
  const canApply = pending.length <= maxReports;
  const addLabel = pending.length
    ? `Add ${pending.length} document${pending.length > 1 ? "s" : ""}`
    : "Add documents";
  const selectedReports = useMemo(
    () => reports.filter((report) => pending.includes(report.id)),
    [pending, reports],
  );

  const toggle = (id: string) => {
    setPending((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < maxReports
          ? [...current, id]
          : current,
    );
  };

  const apply = () => {
    onAdd(
      selectedReports.map((report) => ({
        id: `report-${report.id}`,
        kind: "report",
        reportId: report.id,
        name: report.title,
        publisher: report.publisher,
        status: "ready",
      })),
    );
    onReportsOpenChange(false);
  };

  return (
    <AppSheet
      open={reportsOpen}
      onOpenChange={onReportsOpenChange}
      snapPoints={[90]}
      title="Choose documents"
      description="Select up to five indexed documents for this conversation."
      footer={
        <Button
          width="100%"
          variant="primary"
          disabled={!canApply || pending.length === 0}
          onPress={apply}
        >
          {addLabel}
        </Button>
      }
    >
      <YStack px="$4" pt="$3" pb="$8" gap="$3">
        <XStack
          minH={48}
          items="center"
          gap="$2"
          px="$3"
          bg="$surface1"
          rounded="$4"
        >
          <SearchIcon color={theme.contentSecondary?.val as string} />
          <Input
            aria-label="Search documents"
            value={query}
            onChangeText={setQuery}
            placeholder="Search documents"
            flex={1}
            borderWidth={0}
            bg="$transparent"
            px="$1"
            focusStyle={{
              borderWidth: 0,
              outlineWidth: 0,
              bg: "$transparent",
            }}
          />
          {query ? (
            <IconButton aria-label="Clear search" onPress={() => setQuery("")}>
              <CloseIcon color={theme.contentSecondary?.val as string} />
            </IconButton>
          ) : null}
        </XStack>
        <XStack justify="space-between" items="center">
          <Text size="sm" weight="semibold">
            {pending.length} of {maxReports} selected
          </Text>
        </XStack>
        {loading ? (
          <Text tone="secondary">Loading documents…</Text>
        ) : loadError ? (
          <YStack py="$8" items="center" gap="$3">
            <Text weight="semibold">Document library unavailable</Text>
            <Text size="sm" tone="secondary" center>
              Check your connection and try again.
            </Text>
            <Button
              variant="secondary"
              onPress={() => setReloadKey((value) => value + 1)}
            >
              Retry
            </Button>
          </YStack>
        ) : reports.length === 0 ? (
          <YStack py="$8" items="center" gap="$2">
            <Text weight="semibold">No documents available yet</Text>
            <Text size="sm" tone="secondary" center>
              Ready documents will appear after an admin uploads and indexes
              them.
            </Text>
          </YStack>
        ) : (
          <ScrollView>
            <YStack gap="$1">
              {reports.map((report) => {
                const checked = pending.includes(report.id);
                return (
                  <NativePressable
                    key={report.id}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked }}
                    accessibilityLabel={`Select ${report.title}`}
                    onPress={() => toggle(report.id)}
                  >
                    <XStack
                      minH={74}
                      px="$2"
                      py="$2"
                      gap="$3"
                      rounded="$3"
                      items="center"
                      bg={checked ? "$surface1" : "$transparent"}
                    >
                      <YStack
                        width={24}
                        height={24}
                        rounded="$2"
                        borderWidth={1.5}
                        borderColor={checked ? "$accent" : "$outline"}
                        bg={checked ? "$accent" : "$transparent"}
                        items="center"
                        justify="center"
                      >
                        {checked ? (
                          <CheckIcon
                            size={16}
                            color={theme.contentInverse?.val as string}
                          />
                        ) : null}
                      </YStack>
                      <YStack flex={1} gap="$1">
                        <Text weight="semibold" numberOfLines={2}>
                          {report.title}
                        </Text>
                        <Text size="sm" tone="secondary" numberOfLines={2}>
                          {report.publisher} · {report.publishedAt}
                        </Text>
                      </YStack>
                    </XStack>
                  </NativePressable>
                );
              })}
            </YStack>
          </ScrollView>
        )}
      </YStack>
    </AppSheet>
  );
}
