// Analytics tracking utilities
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
}

export class Analytics {
  private static instance: Analytics;
  private enabled: boolean;

  private constructor() {
    this.enabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  track(event: AnalyticsEvent) {
    if (!this.enabled) return;

    // Implement your analytics tracking here
    console.log('Analytics event:', event);
  }

  identify(userId: string, traits?: Record<string, any>) {
    if (!this.enabled) return;

    console.log('Analytics identify:', { userId, traits });
  }
}

export const analytics = Analytics.getInstance();