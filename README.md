# Maré Alta — Pesca & Exploração

Protótipo 3D de pesca para navegador, com controles para celular e PC. Feito com Three.js, HTML, CSS e JavaScript. Não precisa de instalação de servidor nem build.

## Como testar
1. Extraia o ZIP.
2. Abra `index.html` em um navegador com acesso à internet. Como o jogo usa módulos JavaScript, alguns navegadores não abrem módulos diretamente de `file://`; se isso acontecer, publique no GitHub Pages ou use um servidor local.
3. No GitHub, crie um repositório e envie **os arquivos de dentro desta pasta** (não apenas o ZIP).
4. Abra **Settings → Pages**, escolha a branch `main` e a pasta `/ (root)`, e salve.
5. Aguarde a publicação e abra a URL do GitHub Pages.

## Controles
- PC: WASD / setas para andar, mouse para olhar, F para pescar, Espaço para pular, B para abrir a bolsa, E para interagir. Clique no cenário para capturar o mouse.
- Celular: joystick no canto inferior esquerdo, arraste a tela para olhar e use os botões da interface.

## Recursos atuais
- Ilha 3D com costa, árvores, rochas, cais, cabana, placas, nuvens e oceano animado.
- Pesca com tempo aleatório de mordida e reação.
- 7 espécies, raridades, peso e valor de venda.
- Bolsa de peixes, venda, dinheiro e melhorias de equipamento.
- Interface adaptada a telas pequenas e grandes.
- Salva dinheiro, peixes e capacidade da bolsa no armazenamento local do navegador.

## Limitações desta versão
- É um protótipo single-player: não há contas, multiplayer ou economia compartilhada.
- O jogo usa Three.js por CDN; é necessária conexão com internet para carregar a biblioteca.
- O salvamento é local ao navegador/dispositivo.
- Os modelos são gerados proceduralmente; a próxima etapa pode trocar/expandir os modelos, animações, sons, missões, barcos e regiões.
