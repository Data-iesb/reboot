# TASK - Reboot IESB 2026

## Sobre o Evento
- **Título:** Reboot - IESB 2026 — Impactos da IA nas nossas vidas
- **Data:** 21 e 22 de outubro de 2026
- **Local:** IESB-SUL
- **Site:** reboot.dataiesb.com

## Infraestrutura (✅ Concluída)
- [x] S3 bucket `reboot.dataiesb.com` (profile iesb, static hosting, public)
- [x] ACM certificado emitido (arn:aws:acm:us-east-1:248189947068:certificate/94ce5549-b7a6-43bd-a80b-3544acf2404f)
- [x] CloudFront distribution `E5RH1HRTC0A9I` (d3s7wfd61km1a2.cloudfront.net)
- [x] Route53 A record `reboot.dataiesb.com` → CloudFront
- [x] Template HTML uploaded

## Navegação
- Início
- Sobre
- Programação
- Oficinas
- Parceiros
- Inscrição
- Coordenação

## Tarefas Pendentes

### Design & Imagens
- [ ] Gerar logo do evento (conceito: power button + neural network, IA fazendo Reboot nas vidas)
- [ ] Gerar hero background (abstrato, futurista, cyan/purple)
- [ ] Gerar imagens para seções (oficinas, programação)

### Melhorias no Site
- [ ] Adicionar logo no nav e hero
- [ ] Adicionar hero background image
- [ ] Adicionar animações (scroll reveal, particles)
- [ ] Adicionar countdown timer para o evento
- [ ] Melhorar seção Programação (horários, palestrantes)
- [ ] Melhorar seção Oficinas (detalhes, vagas)
- [ ] Adicionar formulário/link de inscrição
- [ ] Adicionar seção Coordenação com nomes
- [ ] Mobile menu hamburger funcional
- [ ] Favicon
- [ ] Meta tags OG para compartilhamento

## Dados Técnicos
- **AWS Profile:** iesb
- **Account:** 248189947068
- **Hosted Zone:** Z05014761ROYBA3Z5YKY2
- **Repo:** github.com/Data-IESB/reboot
- **Deploy:** `aws s3 sync ./reboot s3://reboot.dataiesb.com --profile iesb`
- **Invalidar cache:** `aws cloudfront create-invalidation --distribution-id E5RH1HRTC0A9I --paths "/*" --profile iesb`
