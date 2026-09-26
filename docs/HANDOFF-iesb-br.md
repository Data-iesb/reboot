# Handoff — publicar o site em reboot.iesb.br (time de rede IESB)

O site do Reboot roda no cluster EKS (dataiesb) atrás do ingress-nginx (NLB).
O lado do cluster **já está pronto**: o `reboot-ingress` já aceita o host
`reboot.iesb.br` e roteia para o pod. Falta apenas o DNS na zona `iesb.br`
(autoritativos `dns3.iesb.br` / `dns4.iesb.br`), que é gerida por vocês.

## 1) DNS — apontar o site (HTTP funciona imediatamente após isto)

Criar na zona `iesb.br`:

```
reboot.iesb.br.   CNAME   reboot.dataiesb.com.
```

(alternativa equivalente, apontando direto ao balanceador:)

```
reboot.iesb.br.   CNAME   k8s-ingressn-ingressn-26ad48bc1e-a729d9f68905afd6.elb.us-east-1.amazonaws.com.
```

Assim que este registro existir, `http://reboot.iesb.br/` carrega o site.

## 2) DNS — validação do certificado TLS (necessário para HTTPS)

Para `https://reboot.iesb.br/` foi solicitado um certificado ACM. A AWS exige
um registro CNAME de validação na zona `iesb.br`:

```
Nome:  _822a42200d553df2845ce35eaad14ddb.reboot.iesb.br.
Tipo:  CNAME
Valor: _76abe5a9b2556ba1d2d5ab74920eff45.wzccmgtwzk.acm-validations.aws.
```

Assim que este CNAME propagar, o certificado é emitido automaticamente
(status ISSUED). Só então anexamos o certificado ao balanceador (passo 3,
feito do nosso lado).

## 3) Do lado do cluster (feito por nós, após o cert ISSUED)

- Anexar o novo cert ao NLB (SNI) na annotation do
  `svc/ingress-nginx-controller`:
  `service.beta.kubernetes.io/aws-load-balancer-ssl-cert` passa a listar os dois ARNs:
  - `arn:aws:acm:us-east-1:248189947068:certificate/6d8e0740-fa40-4171-aff9-7cd815b6e2e8` (dataiesb.com, já existente)
  - `arn:aws:acm:us-east-1:248189947068:certificate/f3db224e-fd5c-4a00-9c8e-c1ec637de8ce` (reboot.iesb.br, novo)

## Estado atual (verificado)

- `reboot-ingress` hosts: `reboot.dataiesb.com`, `reboot.iesb.br` (aplicado).
- Teste via ELB com `Host: reboot.iesb.br`: `/` 200, `/healthz` ok,
  `/docs/edital-04-2026-reboot.pdf` → `application/pdf` (5.108.431 bytes).
- `reboot.iesb.br` ainda retorna NXDOMAIN nos autoritativos `dns3/dns4.iesb.br`
  (registro do passo 1 ainda não criado).
- Cert ACM `reboot.iesb.br`: PENDING_VALIDATION (aguardando o CNAME do passo 2).
