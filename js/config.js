/* =====================================================================
   DONES Y TALENTOS — CONFIGURACIÓN POR DEFECTO
   Todo esto también se edita desde el celular (Control → Equipos / Actividades / Ajustes).
   Lo editado allí se guarda y tiene prioridad sobre este archivo.

   Base doctrinal (módulo "Música y Ministerio", ESCAM · FECP; Biblia Reina-Valera 1960):
   · TALENTO: conjunto de capacidades (artísticas, intelectuales…) que se DESARROLLAN con estudio, práctica y entorno.
     Es el MEDIO con el que se sirve.
   · DON: capacidad que DA el Espíritu Santo por gracia (charis); no se compra ni se aprende (1 Co 12:4, 7, 11).
     Grupos: ministeriales (Ef 4:11), espirituales (1 Co 12:8-10) y de servicio (Ro 12:6-8).
   · MINISTERIO: servicio al Señor. MINISTRAR = poner en acción el don que Dios nos ha dado (1 P 4:10).
   Las rondas usan dones de 1 Co 12 y Ro 12 que se pueden vivir en una actividad sencilla. En cada ronda el DON es
   el tema y el TALENTO es la forma de expresarlo: Decir (equipo 1), Hacer (equipo 2), Escribir (equipo 3).
   Las piezas no se "ganan": cada equipo las recibe y cada misión las PONE EN ACCIÓN.
   ===================================================================== */
var DEFAULT_CONFIG = {
  ver: 5,                  // súbelo si cambias la estructura: reemplaza lo guardado en los aparatos
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

  /* Tipos (disc): decir, hacer, escribir (los talentos de cada equipo) + colectivo y lsc para actividades propias.
     Tiempos cortos: decir 20 s · hacer 20 s · escribir 25 s (la ronda dura lo del reto más largo). */
  challenges: [
    /* Ronda 1 · Don de fe (1 Co 12:9) */
    { id: "c1",  title: "Dios respondió",     disc: "decir",    secs: 20, text: "Cuenten en una frase algo que le pidieron a Dios y Él respondió." },
    { id: "c2",  title: "Un paso de fe",      disc: "hacer",    secs: 20, text: "Den juntos un paso al frente, como quien confía en Dios aunque no ve el camino." },
    { id: "c3",  title: "Mi confianza",       disc: "escribir", secs: 25, text: "Escriban «Confío en Dios porque…» y léanlo en voz alta." },
    /* Ronda 2 · Don de palabra de sabiduría (1 Co 12:8) */
    { id: "c4",  title: "Sabiduría de Dios",  disc: "decir",    secs: 20, text: "Completen en una frase: «La sabiduría de Dios me enseña a…»." },
    { id: "c5",  title: "Pedir sabiduría",    disc: "hacer",    secs: 20, text: "Representen a alguien que se detiene, ora en silencio y luego decide." },
    { id: "c6",  title: "Una petición",       disc: "escribir", secs: 25, text: "Escriban «Señor, dame sabiduría para…» y léanlo en voz alta." },
    /* Ronda 3 · Don de servicio (Ro 12:7) */
    { id: "c7",  title: "Servir esta semana", disc: "decir",    secs: 20, text: "Digan una forma sencilla de servir a alguien de la iglesia esta semana." },
    { id: "c8",  title: "Una mano amiga",     disc: "hacer",    secs: 20, text: "Representen a alguien que ayuda a otra persona a cargar algo pesado." },
    { id: "c9",  title: "Mi compromiso",      disc: "escribir", secs: 25, text: "Escriban a quién van a servir esta semana y cómo." },
    /* Ronda 4 · Don de enseñanza (Ro 12:7) */
    { id: "c10", title: "Un versículo",       disc: "decir",    secs: 20, text: "Elijan un versículo que conozcan y díganlo juntos." },
    { id: "c11", title: "Enseñar un gesto",   disc: "hacer",    secs: 20, text: "Enseñen a los demás un gesto que signifique «Dios te ama»." },
    { id: "c12", title: "Lo aprendido",       disc: "escribir", secs: 25, text: "Escriban algo que aprendieron de Dios y léanlo en voz alta." },
    /* Ronda 5 · Don de exhortación (Ro 12:8) */
    { id: "c13", title: "¡Tú puedes!",        disc: "decir",    secs: 20, text: "Díganle a otro equipo una frase de ánimo." },
    { id: "c14", title: "Aplauso de ánimo",   disc: "hacer",    secs: 20, text: "Aplaudan juntos para animar a otro equipo." },
    { id: "c15", title: "Mensaje de ánimo",   disc: "escribir", secs: 25, text: "Escriban un mensaje de ánimo de una línea para alguien de la iglesia y léanlo." },
    /* Ronda 6 · Don de misericordia (Ro 12:8) */
    { id: "c16", title: "Con compasión",      disc: "decir",    secs: 20, text: "Digan en una frase cómo ayudarían a alguien que sufre." },
    { id: "c17", title: "Mano que se extiende", disc: "hacer",  secs: 20, text: "Representen a alguien que extiende la mano a quien lo necesita." },
    { id: "c18", title: "Una oración",        disc: "escribir", secs: 25, text: "Escriban una oración corta por alguien que sufre y léanla." }
  ],

  /* Una ronda da una pieza a cada equipo. picks = [equipo 1 (decir), equipo 2 (hacer), equipo 3 (escribir)].
     title = el don · talent = talento destacado (el medio) · src = grupo y base bíblica · verse = clave del versículo. */
  plan: [
    { title: "Don de fe",                  talent: "Dar testimonio",       src: "Don espiritual · 1 Corintios 12:9",  picks: ["c1",  "c2",  "c3"],  verse: "fe" },
    { title: "Don de palabra de sabiduría", talent: "Hablar con prudencia", src: "Don espiritual · 1 Corintios 12:8",  picks: ["c4",  "c5",  "c6"],  verse: "sabiduria" },
    { title: "Don de servicio",            talent: "Ayudar con las manos", src: "Don de servicio · Romanos 12:7",     picks: ["c7",  "c8",  "c9"],  verse: "servicio" },
    { title: "Don de enseñanza",           talent: "Explicar con claridad", src: "Don de servicio · Romanos 12:7",    picks: ["c10", "c11", "c12"], verse: "ensenanza" },
    { title: "Don de exhortación",         talent: "Animar con palabras",  src: "Don de servicio · Romanos 12:8",     picks: ["c13", "c14", "c15"], verse: "exhortacion" },
    { title: "Don de misericordia",        talent: "Gestos de compasión",  src: "Don de servicio · Romanos 12:8",     picks: ["c16", "c17", "c18"], verse: "misericordia" }
  ],

  /* Reina-Valera 1960 (textos comprobados; los que terminan en «…» son citas parciales del versículo). */
  verses: {
    main:         { ref: "1 Corintios 12:4",    text: "Ahora bien, hay diversidad de dones, pero el Espíritu es el mismo." },
    provecho:     { ref: "1 Corintios 12:7",    text: "Pero a cada uno le es dada la manifestación del Espíritu para provecho." },
    fe:           { ref: "Hebreos 11:1",        text: "Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve." },
    sabiduria:    { ref: "1 Corintios 12:8",    text: "Porque a este es dada por el Espíritu palabra de sabiduría…" },
    servicio:     { ref: "1 Pedro 4:10",        text: "Cada uno según el don que ha recibido, minístrelo a los otros, como buenos administradores de la multiforme gracia de Dios." },
    ensenanza:    { ref: "Romanos 12:7",        text: "…o si de servicio, en servir; o el que enseña, en la enseñanza;" },
    exhortacion:  { ref: "1 Tesalonicenses 5:11", text: "Por lo cual, animaos unos a otros, y edificaos unos a otros, así como lo hacéis." },
    misericordia: { ref: "Lucas 6:36",          text: "Sed, pues, misericordiosos, como también vuestro Padre es misericordioso." },
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
    question: "¿Qué don te ha dado Dios, y qué talento vas a cultivar para ponerlo al servicio?",
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
  decir:       { label: "Talento · Decir",       icon: "volume" },
  hacer:       { label: "Talento · Hacer",       icon: "mask" },
  escribir:    { label: "Talento · Escribir",    icon: "pen" },
  colectivo:   { label: "Colectivo",             icon: "users" },
  lsc:         { label: "Expresión · LSC",       icon: "hand" }
};

/* Logos: reemplaza los archivos en /assets (o cambia estas rutas). */
var LOGO_SOURCES = {
  "logo-ipuc": "assets/logo-ipuc.webp",
  "logo-artistica": "assets/logo-artistica.webp"
};
