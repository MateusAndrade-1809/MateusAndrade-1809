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
- Resposta de ativação pendente com `success: "false"` mostra o aviso correto e preserva os campos.

As mensagens dos testes automatizados são interceptadas. Esses testes **não comprovam entrega real de e-mail**.

## Site publicado

Em 13/10/2026, o GitHub Pages foi verificado com imagens carregadas e sem erros de execução. O primeiro envio real informou ativação pendente. Após Mateus confirmar a ativação, um segundo envio pelo formulário público retornou HTTP 200, `success: "true"` e `The form was submitted successfully.`. A interface exibiu o aceite do serviço. A chegada na caixa de entrada ainda precisa ser conferida pelo destinatário.

## Revisão do protótipo

O Figma é um artefato separado, com oito telas e sessenta ligações de navegação. Em 13/10/2026, a revisão foi concluída pelo editor normal: aplicada altura automática aos 141 textos e largura automática aos rótulos que quebravam palavras. Os contêineres acompanham o conteúdo. As sete telas desktop e a tela mobile foram inspecionadas individualmente, sem sobreposição ou corte de textos nas capturas revisadas.

As imagens de início desktop, início mobile e contato foram exportadas diretamente do arquivo corrigido. O compartilhamento está configurado como "Qualquer pessoa pode visualizar". Esta revisão de tipografia não altera os destinos de navegação nem o código do site.
