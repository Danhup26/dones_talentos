/* =====================================================================
   DONES Y TALENTOS — CONFIGURACIÓN POR DEFECTO
   Todo esto también se edita desde el celular (Control → Equipos / Actividades / Ajustes).
   Lo editado allí se guarda y tiene prioridad sobre este archivo.

   Base bíblica (Reina-Valera 1960):
   · DONES: el Espíritu de Jehová que reposa sobre el Mesías (Is 11:2-3) y los dones de 1 Co 12:8-10.
     Se eligen los que se pueden vivir en una actividad sencilla. Las rondas, de menor a mayor:
     Temor de Jehová · Fe · Conocimiento · Poder · Consejo · Sabiduría.
   · TALENTOS: lo que cada uno puede hacer y pone al servicio (Mt 25:14-30). En cada ronda, el DON es el tema
     y el TALENTO es la forma de expresarlo: Decir (equipo 1), Hacer (equipo 2), Dibujar (equipo 3).
   · Las piezas no se "ganan": cada equipo las recibe y cada misión las PONE EN ACCIÓN.
   ===================================================================== */
var DEFAULT_CONFIG = {
  ver: 4,                  // súbelo si cambias la estructura: reemplaza lo guardado en los aparatos
  church: "IPUC La Paz · Apartadó",
  title: "DONES Y TALENTOS",
  subtitle: "Muchos dones. Muchas funciones. Un mismo propósito.",
  opening: "Todos recibimos algo.",
  scoreOn: false,          // Puntos opcionales (no recomendado: aquí nadie compite)
  soundOn: true,
  accessible: false,       // Texto más grande y menos movimiento
  rounds: 6,               // De 2 a 8 rondas
  perMission: 1,           // Piezas que entrega cada misión (1 o 2). Rondas × piezas ≤ 8. Total = 3 × rondas × piezas

  teams: [
    { name: "IMPULSO",   color: "#F2B84B" },
    { name: "CREATIVOS", color: "#5BC8F5" },
    { name: "PROPÓSITO", color: "#B9A3FF" }
  ],

  /* Tipos (disc): decir, hacer, dibujar (los talentos de cada equipo) + otros para actividades propias */
  challenges: [
    /* Ronda 1 · Temor de Jehová */
    { id: "c1",  title: "Dios es grande",         disc: "decir",   secs: 20, text: "Digan juntos, en una frase: «Dios es grande porque…»." },
    { id: "c2",  title: "Reverencia",             disc: "hacer",   secs: 25, text: "Tomen una postura de reverencia ante Dios y quédense quietos 10 segundos." },
    { id: "c3",  title: "Su grandeza",            disc: "dibujar", secs: 30, text: "Dibujen en la cartulina algo que muestre lo grande que es Dios." },
    /* Ronda 2 · Fe */
    { id: "c4",  title: "Dios respondió",         disc: "decir",   secs: 20, text: "Cuenten en una frase algo que le pidieron a Dios y Él respondió." },
    { id: "c5",  title: "Un paso de fe",          disc: "hacer",   secs: 25, text: "Representen a alguien que da un paso confiando en Dios, aunque no ve el camino." },
    { id: "c6",  title: "El camino",              disc: "dibujar", secs: 30, text: "Dibujen un camino que solo se ve hasta el siguiente paso, con Dios guiando." },
    /* Ronda 3 · Conocimiento */
    { id: "c7",  title: "Su mano",                disc: "decir",   secs: 20, text: "Nombren tres cosas a su alrededor en las que ven la mano de Dios." },
    { id: "c8",  title: "Fotografía",             disc: "hacer",   secs: 25, text: "Congélense como una foto de algo que Dios creó. Quietos al terminar el tiempo." },
    { id: "c9",  title: "Su obra",                disc: "dibujar", secs: 30, text: "Dibujen algo creado por Dios que les hable de Él." },
    /* Ronda 4 · Poder */
    { id: "c10", title: "Grito de ánimo",         disc: "decir",   secs: 20, text: "Inventen un grito de ánimo de cinco palabras y díganlo juntos." },
    { id: "c11", title: "Cadena firme",           disc: "hacer",   secs: 25, text: "Formen una cadena tomados de las manos y no se suelten durante 15 segundos." },
    { id: "c12", title: "Fuerzas de Dios",        disc: "dibujar", secs: 30, text: "Dibujen a alguien cargando algo pesado y a Dios dándole fuerzas." },
    /* Ronda 5 · Consejo */
    { id: "c13", title: "Un buen consejo",        disc: "decir",   secs: 20, text: "Piensen en alguien que debe tomar una decisión importante y díganle un consejo en una frase." },
    { id: "c14", title: "Pedir consejo",          disc: "hacer",   secs: 25, text: "Representen a alguien que pide consejo y recibe una respuesta sabia." },
    { id: "c15", title: "Dios señala el camino",  disc: "dibujar", secs: 30, text: "Dibujen un camino con una mano que señala por dónde ir." },
    /* Ronda 6 · Sabiduría */
    { id: "c16", title: "Sabiduría de Dios",      disc: "decir",   secs: 20, text: "Completen en una frase: «La sabiduría de Dios me enseña a…»." },
    { id: "c17", title: "Pedir sabiduría",        disc: "hacer",   secs: 25, text: "Representen a alguien que, antes de decidir, le pide sabiduría a Dios." },
    { id: "c18", title: "Luz que guía",           disc: "dibujar", secs: 30, text: "Dibujen una luz que guía a una persona en una decisión." }
  ],

  /* Una ronda da una pieza a cada equipo. picks = [equipo 1 (decir), equipo 2 (hacer), equipo 3 (dibujar)].
     title = el don · talent = talento destacado · src = base bíblica · verse = clave del versículo (abajo). */
  plan: [
    { title: "Don de temor de Jehová", talent: "Reverencia",              src: "Isaías 11:2-3 · Proverbios 9:10",              picks: ["c1",  "c2",  "c3"],  verse: "temor" },
    { title: "Don de fe",              talent: "Dar testimonio",          src: "1 Corintios 12:9 · Hebreos 11:1",              picks: ["c4",  "c5",  "c6"],  verse: "fe" },
    { title: "Don de conocimiento",    talent: "Observar",                src: "Isaías 11:2 · 1 Corintios 12:8 · Salmo 19:1",  picks: ["c7",  "c8",  "c9"],  verse: "conocimiento" },
    { title: "Don de poder",           talent: "Perseverar y animar",     src: "Isaías 11:2 · Hechos 1:8",                     picks: ["c10", "c11", "c12"], verse: "poder" },
    { title: "Don de consejo",         talent: "Escuchar y orientar",     src: "Isaías 11:2 · Salmo 32:8",                     picks: ["c13", "c14", "c15"], verse: "consejo" },
    { title: "Don de sabiduría",       talent: "Compartir lo aprendido",  src: "Isaías 11:2 · 1 Corintios 12:8 · Santiago 1:5", picks: ["c16", "c17", "c18"], verse: "sabiduria" }
  ],

  /* Reina-Valera 1960 (textos comprobados; los que terminan en «…» son citas parciales del versículo). */
  verses: {
    main:         { ref: "1 Corintios 12:4",    text: "Ahora bien, hay diversidad de dones, pero el Espíritu es el mismo." },
    isaias:       { ref: "Isaías 11:2",         text: "Y reposará sobre él el Espíritu de Jehová; espíritu de sabiduría y de inteligencia, espíritu de consejo y de poder, espíritu de conocimiento y de temor de Jehová." },
    corintios:    { ref: "1 Corintios 12:8-9",  text: "Porque a este es dada por el Espíritu palabra de sabiduría; a otro, palabra de ciencia según el mismo Espíritu; a otro, fe por el mismo Espíritu;" },
    temor:        { ref: "Proverbios 9:10",     text: "El temor de Jehová es el principio de la sabiduría, y el conocimiento del Santísimo es la inteligencia." },
    fe:           { ref: "Hebreos 11:1",        text: "Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve." },
    conocimiento: { ref: "Salmo 19:1",          text: "Los cielos cuentan la gloria de Dios, y el firmamento anuncia la obra de sus manos." },
    poder:        { ref: "Hechos 1:8",          text: "…recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo…" },
    consejo:      { ref: "Salmo 32:8",          text: "Te haré entender, y te enseñaré el camino en que debes andar; sobre ti fijaré mis ojos." },
    sabiduria:    { ref: "Santiago 1:5",        text: "Y si alguno de vosotros tiene falta de sabiduría, pídala a Dios, el cual da a todos abundantemente y sin reproche…" },
    talentos:     { ref: "Mateo 25:15",         text: "A uno dio cinco talentos, y a otro dos, y a otro uno, a cada uno conforme a su capacidad; y luego se fue lejos." },
    servir:       { ref: "1 Pedro 4:10",        text: "Cada uno según el don que ha recibido, minístrelo a los otros, como buenos administradores de la multiforme gracia de Dios." },
    final:        { ref: "Mateo 25:21",         text: "Y su señor le dijo: Bien, buen siervo y fiel; sobre poco has sido fiel, sobre mucho te pondré; entra en el gozo de tu señor." },
    body:         { ref: "Romanos 12:4-5",      text: "Porque de la manera que en un cuerpo tenemos muchos miembros, pero no todos los miembros tienen la misma función, así nosotros, siendo muchos, somos un cuerpo en Cristo, y todos miembros los unos de los otros." },
    members:      { ref: "1 Corintios 12:27",   text: "Vosotros, pues, sois el cuerpo de Cristo, y miembros cada uno en particular." }
  },

  /* Ruleta del Cuerpo (1 Co 12:14-21): NO reparte dones; elige qué hace todo el cuerpo a la vez.
     after = después de qué rondas (0 = ronda 1) aparece sola en el recorrido. */
  wheel: {
    after: [2],
    slices: [
      { label: "Ojo",     action: "Mira a quien tienes cerca y dile qué don o talento ves en él.",                      verse: { ref: "Romanos 12:10",         text: "Amaos los unos a los otros con amor fraternal; en cuanto a honra, prefiriéndoos los unos a los otros." } },
      { label: "Mano",    action: "Dale la mano a alguien y bendícelo: «Dios te bendiga, gracias por…».",               verse: { ref: "Gálatas 6:2",           text: "Sobrellevad los unos las cargas de los otros, y cumplid así la ley de Cristo." } },
      { label: "Oído",    action: "En parejas: uno cuenta algo que Dios le ha dado; el otro solo escucha.",             verse: { ref: "Santiago 1:19",         text: "Por esto, mis amados hermanos, todo hombre sea pronto para oír, tardo para hablar, tardo para airarse…" } },
      { label: "Boca",    action: "Dile a alguien una frase corta de ánimo.",                                           verse: { ref: "1 Tesalonicenses 5:11", text: "Por lo cual, animaos unos a otros, y edificaos unos a otros, así como lo hacéis." } },
      { label: "Pie",     action: "Levántate y saluda a alguien que no conoces, sobre todo a los visitantes.",          verse: { ref: "Romanos 15:7",          text: "Por tanto, recibíos los unos a los otros, como también Cristo nos recibió, para gloria de Dios." } },
      { label: "Corazón", action: "Ora en voz baja por quien está a tu lado.",                                          verse: { ref: "1 Corintios 12:26",     text: "De manera que si un miembro padece, todos los miembros se duelen con él, y si un miembro recibe honra…" } }
    ]
  },

  /* Pausa de silencio antes del final */
  pause: {
    title: "Un momento de silencio",
    question: "¿Qué te ha dado Dios que todavía no has puesto en acción?",
    secs: 45,
    verse: { ref: "Salmos 46:10", text: "Estad quietos, y conoced que yo soy Dios; seré exaltado entre las naciones; enaltecido seré en la tierra." }
  },

  credits: {
    line1: "Comité de Artística",
    line2: "Arte Audiovisual",
    line3: "en colaboración con",
    line4: "Comité de Jóvenes",
    tagline: "Una producción de Artística — Arte Audiovisual, en apoyo al culto de jóvenes.",
    bible: "Textos bíblicos: Reina-Valera 1960 © Sociedades Bíblicas en América Latina"
  },

  /* Sonidos opcionales: pega una URL (mp3/ogg) para reemplazar el sonido sintetizado. */
  sounds: { start: "", tick: "", time: "", complete: "", piece: "", transition: "", assemble: "" }
};

var DISCIPLINES = {
  decir:       { label: "Talento · Decir",       icon: "pen" },
  hacer:       { label: "Talento · Hacer",       icon: "mask" },
  dibujar:     { label: "Talento · Dibujar",     icon: "palette" },
  recibir:     { label: "Gracia · Recibir",      icon: "book" },
  don:         { label: "Don · Edificar",        icon: "users" },
  amor:        { label: "Amor · Un cuerpo",      icon: "users" },
  escenico:    { label: "Talento · Escénico",    icon: "mask" },
  plastico:    { label: "Talento · Plástico",    icon: "palette" },
  literario:   { label: "Talento · Literario",   icon: "pen" },
  lsc:         { label: "Expresión · LSC",       icon: "hand" },
  audiovisual: { label: "Talento · Audiovisual", icon: "camera" },
  colectivo:   { label: "Colectivo",             icon: "users" }
};

/* Logos: reemplaza los archivos en /assets (o cambia estas rutas). */
var LOGO_SOURCES = {
  "logo-ipuc": "assets/logo-ipuc.webp",
  "logo-artistica": "assets/logo-artistica.webp"
};
