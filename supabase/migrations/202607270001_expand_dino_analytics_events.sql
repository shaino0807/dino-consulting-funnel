alter table public.analytics_events
  drop constraint if exists analytics_events_type_check;

alter table public.analytics_events
  add constraint analytics_events_type_check
  check (
    type in (
      'page_view',
      'link_click',
      'lead_submit',
      'hero_cta_click',
      'topic_selected',
      'consultation_cta_click',
      'form_started',
      'form_validation_error',
      'lead_submit_success',
      'lead_submit_failed',
      'resource_expanded',
      'resource_opened',
      'booking_requested'
    )
  );
