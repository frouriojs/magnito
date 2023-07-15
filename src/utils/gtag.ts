export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

export const gaPageview = (url: string) => {
  window.gtag('config', GA_ID, { page_path: url });
};

export const gaEvent = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}): void => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};
