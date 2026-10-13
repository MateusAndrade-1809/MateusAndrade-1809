# Laboratório 01: acompanhamento dos requisitos

Referência: LABORATÓRIO 01 - Portfólio Profissional, fornecido pelo aluno. A proposta preserva o portfólio RPG, com navegação convencional disponível para quem não quiser jogar.

| Requisito | Implementação | Verificação |
| --- | --- | --- |
| Sobre mim em português e inglês | Formação, trajetória, interesses e objetivo na sala Sobre mim | Idioma muda a interface e persiste após recarregar |
| Menu | Sete destinos, menu móvel e URLs com fragmento | Navegação direta e histórico do navegador |
| Projetos em ordem cronológica | Seis projetos, do mais antigo ao mais recente | Teste automatizado confirma ordenação; filtros são opcionais |
| Nome, descrição, tecnologias e repositório | Cada entrada da linha do tempo contém os quatro itens | Dados curados e repositórios públicos confirmados |
| Projeto em funcionamento | Capturas reais, ampliáveis em galeria | Todos os arquivos locais carregam; API-Clima mostra resposta real |
| Experiências | PUC Minas, desenvolvimento em equipe e We Make Software | Relato do aluno, sem inventar experiência profissional remunerada |
| Contatos clicáveis | E-mail, WhatsApp, LinkedIn e GitHub | URLs e número autorizados pelo aluno |
| Formulário que envia e-mail | Integração FormSubmit, nome/e-mail/mensagem, consentimento, erros e confirmação | Ativação confirmada pelo aluno; envio real pelo site público aceito pela API em 13/10/2026 |
| Responsividade | Desktop, tablet e celular | Sete telas verificadas em 320, 390 e 1440 pixels, sem rolagem horizontal |
| Hospedagem gratuita | GitHub Pages no endereço já usado no perfil | Publicação por GitHub Actions |
| README e instruções | Instalação, scripts, APIs, estrutura, demonstração, testes e créditos | Documentação na pasta `portfolio` do repositório de perfil |
| Protótipo no Figma | Sete telas desktop e uma mobile, com navegação entre telas | Arquivo criado na equipe pessoal; revisão final de tipografia pendente por limite do plano Starter |

## Pendências de entrega

1. Conferir a chegada da mensagem real de teste na caixa de entrada. A ativação foi confirmada pelo aluno e a API aceitou o envio, mas isso não comprova entrega na caixa de entrada.
2. Finalizar o ajuste de altura dos textos no Figma, especialmente no perfil da tela inicial. O limite de chamadas do plano Starter interrompeu a correção. Isso não afeta o site, cujas telas foram verificadas separadamente.
3. Confirmar, antes da apresentação, se o professor exige algum item adicional fora do PDF enviado. Não foram inventados data exata do evento, certificado ou foto da premiação.

## Evidências

- [Protótipo editável](https://www.figma.com/design/A1ZWmBh1MmZkDaChWUurL0)
- [Tela inicial desktop](screenshots/world-1440.png)
- [Tela inicial mobile](screenshots/world-390.png)
- [Projetos](screenshots/projects-1440.png)
- [Contato mobile](screenshots/contact-390.png)
- [Wireframe de contato](screenshots/wireframe-contact.png)
- [Relatório dos testes](TESTING.md)
