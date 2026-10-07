/* =====================================================================
   DONES Y TALENTOS — CONFIGURACIÓN POR DEFECTO
   Todo esto también se edita desde el celular (Control → Equipos / Actividades / Ajustes).
   Lo editado allí se guarda y tiene prioridad sobre este archivo.

   Base bíblica:
   · DONES: los reparte el Espíritu como él quiere, para provecho común (1 Co 12:4-11; Ro 12:6-8; Ef 4:11-12; 1 P 4:10).
   · TALENTOS: el Señor los confía a cada uno conforme a su capacidad, para administrarlos y multiplicarlos (Mt 25:14-30).
   · Las piezas no se "ganan": cada equipo las recibe y cada misión las PONE EN ACCIÓN.
   ===================================================================== */
var DEFAULT_CONFIG = {
  ver: 3,                  // súbelo si cambias la estructura: reemplaza lo guardado en los aparatos
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

  /* Tipos (disc): recibir, don, amor + talentos: escenico, plastico, literario, lsc, audiovisual, colectivo */
  challenges: [
    /* Ronda 1 · Todo viene de Dios */
    { id: "c1",  title: "Gracias",              disc: "recibir",    secs: 30, text: "Nombren en voz alta tres cosas que Dios les ha dado: una persona, una habilidad y una oportunidad. Nadie presume: todos agradecen." },
    { id: "c2",  title: "Recibido",             disc: "recibir",    secs: 40, text: "En la cartulina, dibujen algo que recibieron de Dios sin merecerlo." },
    { id: "c3",  title: "La gloria es de Dios", disc: "recibir",    secs: 35, text: "Representen a alguien que recibe un elogio y responde dando la gloria a Dios." },
    /* Ronda 2 · Un mismo Espíritu, diversos dones */
    { id: "c4",  title: "Servir",               disc: "don",        secs: 40, text: "Piensen una forma sencilla de servir a alguien de la iglesia esta semana y represéntenla." },
    { id: "c5",  title: "Animar",               disc: "don",        secs: 40, text: "Escriban una frase de máximo 7 palabras para animar a alguien que pasa un momento difícil. Léanla a otro equipo." },
    { id: "c6",  title: "Enseñar",              disc: "don",        secs: 35, text: "Sin palabras, enseñen a otro equipo un gesto que signifique «Dios te ama»." },
    /* Ronda 3 · Talentos: administrar lo confiado */
    { id: "c7",  title: "Un recurso, mil usos", disc: "plastico",   secs: 40, text: "Con una hoja de papel, creen algo que sirva a otra persona." },
    { id: "c8",  title: "Multiplicar",          disc: "literario",  secs: 40, text: "Tomen la frase «Dios es bueno» y multiplíquenla: conviértanla en un poema o canción de 4 líneas." },
    { id: "c9",  title: "Fotograma",            disc: "audiovisual",secs: 30, text: "Congélense como una fotografía de alguien que usa lo que sabe hacer para bendecir a otros. Quietos al terminar el tiempo." },
    /* Ronda 4 · Talentos: no enterrarlos */
    { id: "c10", title: "El miedo a empezar",   disc: "escenico",   secs: 40, text: "Representen a alguien que sabe hacer algo, pero no se atreve; y a otra persona que lo anima a dar el paso." },
    { id: "c11", title: "Atrévete",             disc: "colectivo",  secs: 25, text: "Todos a la vez: cada integrante muestra en pocos segundos algo que sabe hacer. Con respeto y alegría." },
    { id: "c12", title: "No lo escondas",       disc: "literario",  secs: 40, text: "Escriban una frase de máximo 7 palabras que invite a no esconder lo que Dios nos dio." },
    /* Ronda 5 · Dones para servir */
    { id: "c13", title: "Servicio en silencio", disc: "lsc",        secs: 30, text: "Representen, sin hablar, una escena donde alguien recibe ayuda de forma discreta." },
    { id: "c14", title: "Manos que sirven",     disc: "don",        secs: 25, text: "Entre todos, formen con las manos una figura que represente SERVICIO." },
    { id: "c15", title: "Te necesitamos",       disc: "lsc",        secs: 25, text: "Sin voz, díganle a otro equipo: «Te necesitamos»." },
    /* Ronda 6 · Con amor, un solo cuerpo */
    { id: "c16", title: "Afirmar",              disc: "amor",       secs: 30, text: "Digan en voz alta a otro equipo qué don o talento ven en él. Solo cosas buenas y verdaderas." },
    { id: "c17", title: "Gratitud",             disc: "amor",       secs: 30, text: "Escriban un mensaje de gratitud para alguien que sirve en la iglesia y compártanlo con otro equipo." },
    { id: "c18", title: "Una sola melodía",     disc: "amor",       secs: 25, text: "Solo con palmas y el cuerpo, creen juntos un ritmo de celebración." }
  ],

  /* Una ronda da una pieza a cada equipo. "verse" = clave del versículo (abajo) que se muestra con los retos. */
  plan: [
    { title: "Todo viene de Dios",                   picks: ["c1",  "c2",  "c3"],  verse: "gracia" },
    { title: "Un mismo Espíritu, diversos dones",    picks: ["c4",  "c5",  "c6"],  verse: "dones" },
    { title: "Talentos: administrar lo confiado",    picks: ["c9",  "c8",  "c7"],  verse: "talentos" },
    { title: "Talentos: no enterrarlos",             picks: ["c10", "c11", "c12"], verse: "enterrar" },
    { title: "Dones para servir",                    picks: ["c13", "c14", "c15"], verse: "servir" },
    { title: "Con amor, un solo cuerpo",             picks: ["c16", "c17", "c18"], verse: "cuerpo" }
  ],

  /* Reina-Valera 1960 */
  verses: {
    main:     { ref: "1 Corintios 12:4",   text: "Ahora bien, hay diversidad de dones, pero el Espíritu es el mismo." },
    gracia:   { ref: "Santiago 1:17",      text: "Toda buena dádiva y todo don perfecto desciende de lo alto, del Padre de las luces." },
    dones:    { ref: "1 Corintios 12:4-5", text: "Ahora bien, hay diversidad de dones, pero el Espíritu es el mismo. Y hay diversidad de ministerios, pero el Señor es el mismo." },
    talentos: { ref: "Mateo 25:15",        text: "A uno dio cinco talentos, y a otro dos, y a otro uno, a cada uno conforme a su capacidad." },
    enterrar: { ref: "Mateo 25:25",        text: "Por lo cual tuve miedo, y fui y escondí tu talento en la tierra; aquí tienes lo que es tuyo." },
    servir:   { ref: "1 Pedro 4:10",       text: "Cada uno según el don que ha recibido, minístrelo a los otros, como buenos administradores de la multiforme gracia de Dios." },
    cuerpo:   { ref: "1 Corintios 12:21",  text: "Ni el ojo puede decir a la mano: No te necesito, ni tampoco la cabeza a los pies: No tengo necesidad de vosotros." },
    love:     { ref: "1 Corintios 13:1",   text: "Si yo hablase lenguas humanas y angélicas, y no tengo amor, vengo a ser como metal que resuena, o címbalo que retiñe." },
    body:     { ref: "Romanos 12:4-5",     text: "Porque de la manera que en un cuerpo tenemos muchos miembros, pero no todos los miembros tienen la misma función, así nosotros, siendo muchos, somos un cuerpo en Cristo." },
    members:  { ref: "1 Corintios 12:27",  text: "Vosotros, pues, sois el cuerpo de Cristo, y miembros cada uno en particular." },
    final:    { ref: "Mateo 25:21",        text: "Bien, buen siervo y fiel; sobre poco has sido fiel, sobre mucho te pondré; entra en el gozo de tu señor." }
  },

  /* Ruleta del Cuerpo (1 Co 12:14-21): NO reparte dones; elige qué hace todo el cuerpo a la vez.
     after = después de qué rondas (0 = ronda 1) aparece sola en el recorrido. */
  wheel: {
    after: [1, 3],
    slices: [
      { label: "Ojo",     action: "Mira a quien tienes cerca y dile qué don o talento ves en él.",                      verse: { ref: "Romanos 12:10",         text: "En cuanto a honra, prefiriéndoos los unos a los otros." } },
      { label: "Mano",    action: "Dale la mano a alguien y bendícelo: «Dios te bendiga, gracias por…».",               verse: { ref: "Gálatas 6:2",           text: "Sobrellevad los unos las cargas de los otros, y cumplid así la ley de Cristo." } },
      { label: "Oído",    action: "En parejas: uno cuenta algo que Dios le ha dado; el otro solo escucha.",             verse: { ref: "Santiago 1:19",         text: "Todo hombre sea pronto para oír, tardo para hablar, tardo para airarse." } },
      { label: "Boca",    action: "Dile a alguien una frase corta de ánimo.",                                           verse: { ref: "1 Tesalonicenses 5:11", text: "Animaos unos a otros, y edificaos unos a otros, así como lo hacéis." } },
      { label: "Pie",     action: "Levántate y saluda a alguien que no conoces, sobre todo a los visitantes.",          verse: { ref: "Romanos 15:7",          text: "Recibíos los unos a los otros, como también Cristo nos recibió, para gloria de Dios." } },
      { label: "Corazón", action: "Ora en voz baja por quien está a tu lado.",                                          verse: { ref: "1 Corintios 12:26",     text: "Si un miembro padece, todos los miembros se duelen con él; y si un miembro es honrado, todos los miembros con él se gozan." } }
    ]
  },

  /* Pausa de silencio antes del final */
  pause: {
    title: "Un momento de silencio",
    question: "¿Qué te ha dado Dios que todavía no has puesto en acción?",
    secs: 60,
    verse: { ref: "Salmos 46:10", text: "Estad quietos, y conoced que yo soy Dios." }
  },

  credits: {
    line1: "Comité de Artística",
    line2: "Arte Audiovisual",
    line3: "en colaboración con",
    line4: "Comité de Jóvenes",
    tagline: "Una producción de Artística — Arte Audiovisual, en apoyo al culto de jóvenes."
  },

  /* Sonidos opcionales: pega una URL (mp3/ogg) para reemplazar el sonido sintetizado. */
  sounds: { start: "", tick: "", time: "", complete: "", piece: "", transition: "", assemble: "" }
};

var DISCIPLINES = {
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
