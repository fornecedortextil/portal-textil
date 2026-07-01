<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Fornecedor Têxtil — Portal B2B</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --navy:       #0D1F3C;
        --navy-mid:   #162d5a;
        --navy-soft:  #EEF2F8;
        --gold:       #C8A030;
        --gold-light: #D4B04A;
        --gold-soft:  #FDF8EC;
        --gold-dark:  #A07820;
        --ink:        #0D1F3C;
        --ink-soft:   #5A6A84;
        --line:       #DDE3EE;
        --canvas:     #F4F6FA;
        --white:      #FFFFFF;
      }

      body {
        font-family: 'Inter', system-ui, sans-serif;
        background: var(--canvas);
        color: var(--ink);
        -webkit-font-smoothing: antialiased;
      }

      /* elevation helpers */
      .elev-1 { box-shadow: 0 1px 3px rgba(13,31,60,.08), 0 1px 2px rgba(13,31,60,.06); }
      .elev-2 { box-shadow: 0 4px 12px rgba(13,31,60,.10), 0 2px 4px rgba(13,31,60,.06); }
      .elev-3 { box-shadow: 0 8px 24px rgba(13,31,60,.12), 0 4px 8px rgba(13,31,60,.06); }

      /* card hover lift */
      .card-lift { transition: transform .18s ease, box-shadow .18s ease; }
      .card-lift:hover { transform: translateY(-2px); }
      .card-lift:hover.elev-1 { box-shadow: 0 4px 12px rgba(13,31,60,.10); }

      /* focus ring */
      *:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }

      /* scrollbar subtle */
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 999px; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .fade-up { animation: fadeUp .4s ease both; }

      @keyframes pulse-dot {
        0%,100% { opacity: 1; } 50% { opacity: .35; }
      }
      .pulse-dot { animation: pulse-dot 2s ease infinite; }
    </style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
