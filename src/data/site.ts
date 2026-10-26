// Language-neutral facts from content/cv.md. All text shown on the site is in src/i18n/*.json.

export const profile = {
  name: 'Islem Rebhi',
};

export const links = {
  email: 'islem.rebhi@esprit.tn',
  github: 'https://github.com/Islem-rb',
  linkedin: 'https://www.linkedin.com/in/rebhi-islem/',
};

// GitOps EKS Platform delivery flow ("Delivery flow" line of cv.md). Step names are in
// projectPage.flowSteps of each language file, in the same order.
export const deliveryFlowDetail: string[][] = [[], ['OIDC', 'Trivy', 'SBOM', 'Cosign'], [], [], ['Argo Rollouts'], ['Prometheus', 'Grafana', 'Loki', 'Alertmanager']];
