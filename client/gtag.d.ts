interface Window {
  gtag(type: 'config', googleAnalyticsId: string, { page_path: string });
  gtag(
    type: 'event',
    eventAction: string,
    fieldObject: { event_label: string; event_category: string; value?: number }
  );
}
