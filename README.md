# Provador Virtual de Brincos

Aplicação web minimalista para visualizar brincos em uma foto da orelha antes da aplicação. O usuário envia ou tira uma foto, marca a posição do furo, escolhe um modelo do catálogo e ajusta o brinco diretamente sobre a imagem.

## O que o site oferece

- Upload de foto ou captura pela câmera.
- Marcação do local do furo.
- Catálogo com oito modelos reais: Tiffany Rubi, Bezel Cristal, Bezel Rosa, Bolinha 3 mm e quatro variações Daisy.
- Controles para mover, redimensionar, girar, espelhar e ajustar a opacidade do brinco.
- Campo de preço para cada modelo, salvo no navegador.
- Download da montagem final em PNG ou JPG.
- Funcionamento responsivo em celular e computador.

As fotos e os ajustes são processados no próprio navegador. Nenhuma imagem da orelha é enviada para serviços externos e nenhuma API de inteligência artificial é utilizada.

## Executar localmente

Na pasta do projeto, execute:

```bash
python -m http.server 8080
```

Depois, acesse `http://localhost:8080`.

## Publicação

O projeto é estático e pode ser publicado diretamente na Vercel, Netlify, Firebase Hosting ou GitHub Pages.

## Atualizações do site

O arquivo `version.json` controla o aviso **Site atualizado**. Ao publicar uma nova versão, altere o valor de `version`. Quando o usuário clicar no aviso, o site limpa o cache disponível e recarrega os arquivos mais recentes sem apagar os preços salvos no navegador.

## Direitos de imagem

As imagens e os nomes comerciais dos brincos pertencem aos respectivos titulares. Confirme a autorização necessária antes de utilizar o catálogo comercialmente.
