# Verificação

Revisão realizada em 13/10/2026.

## Verificações automatizadas

- TypeScript: compilação sem erros.
- ESLint: sem erros. As duas superfícies do jogo usam `role="application"`, foco e controles próprios de teclado; somente as regras incompatíveis com esse uso são excepcionadas nesses arquivos.
- Testes de lógica: 11 casos sobre ordenação, URLs seguras, cache inválido, dados públicos, distribuição de linguagens, validação de formulário, clima e respostas das APIs.
- Auditoria de dependências: nenhuma vulnerabilidade conhecida reportada após as atualizações aplicadas.
- Build estático: geração de HTML, CSS, JavaScript, fontes e imagens para GitHub Pages.

## Navegador

Verificação em Chrome/Playwright, nas larguras 320, 390 e 1440 pixels:

- Sete seções sem transbordamento horizontal ou imagens quebradas.
- Pesquisa, categoria, inversão cronológica, resultado vazio e galeria com Escape.
- Português/inglês e persistência da escolha.
- Canvas não vazio, movimento do personagem e entrada na sala ao alcançar o portal.
- Menu móvel, foco e acesso direto às seções.
- Falha e limite de requisições do GitHub preservam a cópia local, identificada como tal.
- Falha da Open-Meteo não impede o uso do portfólio.
- Formulário exige os campos e o consentimento; erro de rede mantém a mensagem.
- Resposta simulada de sucesso limpa os campos apenas após o aceite do serviço.

As mensagens dos testes automatizados são interceptadas. Esses testes **não comprovam entrega real de e-mail**. A ativação e o recebimento precisam ser confirmados pelo titular da caixa de entrada.

## Limite do protótipo

O site foi inspecionado por capturas de tela. O Figma é um artefato separado: tem oito telas e sessenta ligações de navegação, mas o ajuste final de altura de textos foi interrompido pelo limite do plano Starter. A imagem do wireframe de contato foi revisada; não considerar todas as telas do Figma aprovadas visualmente.
