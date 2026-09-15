# Reboot IESB 2026 — site do evento

Site estático (HTML/JS + `content.json` + imagens) do evento **Reboot IESB 2026**,
servido por **nginx** no cluster EKS `dataiesb-cluster`.
Host público: **https://reboot.dataiesb.com**

## Como o coordenador atualiza os dados

Todo o conteúdo do site vem de **`content.json`** (títulos, programação,
palestrantes, parceiros, coordenação, links de inscrição/edital) e das imagens
em **`img/`**. Para atualizar:

1. Edite `content.json` e/ou adicione imagens em `img/`.
2. Faça commit e `git push` na branch **`main`**.
3. Pronto. O CI/CD (GitHub Actions → ECR → EKS) reconstrói a imagem e atualiza o
   site automaticamente em ~2–3 min. Não é preciso mexer em Kubernetes.

O pipeline está em `.github/workflows/deploy.yml` (build → push ECR → rollout).
`buildspec.yml` oferece o mesmo fluxo caso o gatilho seja via AWS CodeBuild.

## Arquitetura no cluster

```
Internet
  → reboot.dataiesb.com  (ingress-nginx ELB, TLS termina aqui)
    → Ingress "reboot-ingress" (namespace reboot)   [em infra-network/ingress.yaml]
      → Service ClusterIP "reboot" (namespace reboot, :80)
        → Deployment "reboot" (2 réplicas, nginx:alpine)
          → Pod (conteúdo estático em /usr/share/nginx/html)
```

- **Namespace:** `reboot`
- **Imagem ECR:** `248189947068.dkr.ecr.us-east-1.amazonaws.com/reboot`
- **Ingress:** regra dedicada para `reboot.dataiesb.com` no arquivo compartilhado
  `~/dataiesb/infra-network/ingress.yaml` (padrão host-dedicado, como ghost/neo4j).

## Arquivos

| Arquivo | Papel |
|---------|-------|
| `Dockerfile` | Imagem nginx (base `public.ecr.aws/nginx/nginx:1.27-alpine`) que copia o site. |
| `nginx.conf` | Config nginx: gzip, cache, `/healthz`, `content.json` sem cache. |
| `k8s/deployment.yaml` | Namespace + Deployment + Service ClusterIP. |
| `k8s/ingress-snippet.yaml` | Referência da regra de Ingress (a real vive em `infra-network/ingress.yaml`). |
| `buildspec.yml` | CodeBuild: build → push ECR → deploy EKS. |
| `.github/workflows/deploy.yml` | GitHub Actions: mesmo fluxo, disparado no push da `main`. |

## Deploy manual (se necessário)

```bash
export AWS_PROFILE=iesb
aws eks update-kubeconfig --name dataiesb-cluster --region us-east-1

kubectl apply -f k8s/deployment.yaml
kubectl apply -f ~/dataiesb/infra-network/ingress.yaml   # regra reboot-ingress

kubectl rollout status deployment/reboot -n reboot --timeout=180s
kubectl get pods -n reboot -l app=reboot
curl -I https://reboot.dataiesb.com/
```

## DNS

Apontar `reboot.dataiesb.com` (Route53, zona `Z05014761ROYBA3Z5YKY2`) para o ELB
do ingress-nginx (registro A-alias), substituindo o alias antigo do CloudFront.
