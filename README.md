# Provador Virtual de Brincos

Aplicação web estática e responsiva para experimentar brincos sobre uma foto da orelha.

## Catálogo

- 37 modelos reais e verificados das linhas **Studex System75 Baby** e **Studex System75**.
- Nomes oficiais, tamanhos, códigos e referências do fabricante.
- Os oito modelos da foto enviada aparecem primeiro no catálogo.
- Modelos inventados, emojis e SVGs genéricos foram removidos.

## Funcionalidades

- Upload por arquivo ou câmera.
- Marcação do furo, arraste, tamanho, rotação, opacidade e espelhamento.
- Preço individual por brinco, salvo no `localStorage`.
- Exportação PNG ou JPG.
- Ajuste visual local de luz, sombra e contato, sem OpenAI ou API de IA.

## Execução local

```bash
python -m http.server 8080
```

Acesse `http://localhost:8080`. É necessária conexão com a internet para carregar as fotografias oficiais dos modelos que não fazem parte dos oito recortes locais.

## Publicação

A pasta pode ser publicada diretamente na Vercel, Netlify, Firebase Hosting ou GitHub Pages.

## Direitos de imagem

As fotografias e nomenclaturas oficiais pertencem aos respectivos titulares. Confirme a autorização do fabricante antes do uso comercial.


## Miniaturas em alta qualidade

- As imagens do catálogo são carregadas em resolução maior quando a fonte permite.
- O navegador recorta apenas a vista frontal do brinco e remove o fundo claro.
- As peças locais usam PNG transparente de 1024 × 1024.
- Fotos que mostram haste e tarraxa não são usadas diretamente como miniatura do catálogo.
