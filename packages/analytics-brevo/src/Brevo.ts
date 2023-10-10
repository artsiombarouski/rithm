const API_URL = 'https://in-automate.brevo.com/api/v2';

type BrevoOptions = {
  clientKey: string;
  environment: string;
};

export class Brevo {
  private headers: { [key: string]: any };
  private userEmail?: string;
  private userProperties?: { [key: string]: any } = {};

  constructor(readonly options: BrevoOptions) {
    this.headers = {
      Accept: 'application/json',
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'ma-key': this.options.clientKey,
    };
  }

  async identify(email?: string, properties?: { [key: string]: any }) {
    Object.assign(this.userProperties, properties);
    if (!email) {
      return;
    }
    this.userEmail = email;
    return await fetch(`${API_URL}/identify`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        email: email,
        attributes: {
          ...this.userProperties,
          environment: this.options.environment,
        },
      }),
    }).then((res) => res.json());
  }

  async setUserProperties(properties?: { [key: string]: any }) {
    Object.assign(this.userProperties, properties);
    if (!this.userEmail) {
      return;
    }
    return await fetch(`${API_URL}/identify`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        email: this.userEmail,
        attributes: {
          ...this.userProperties,
          environment: this.options.environment,
        },
      }),
    }).then((res) => res.json());
  }

  async trackEvent(name: string, properties?: { [key: string]: any }) {
    if (!this.userEmail) {
      return;
    }
    return await fetch(`${API_URL}/trackEvent`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        event: name,
        email: this.userEmail,
        properties: {
          ...properties,
          environment: this.options.environment,
        },
      }),
    }).then((res) => res.json());
  }

  async trackPageView(name: string, properties?: { [key: string]: any }) {
    if (!this.userEmail) {
      return;
    }
    return await fetch(`${API_URL}/trackPage`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        page: name,
        email: this.userEmail,
        properties: {
          ...properties,
          environment: this.options.environment,
        },
      }),
    }).then((res) => res.json());
  }
}
