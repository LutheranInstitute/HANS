# HANS · robotface de #OSW ante la IOA

**HANS** es la cara robot que representa a #OPENSOURCEWARE (OSW) ante la IOA (#internetofagents), nombrada en honor a **Hans Nielsen Hauge**, el predicador laico noruego que unió fe, trabajo y emprendimiento.

- Raíz del monorepo OSW.os: la cara vive en `index.html`.
- Su primer trabajo: cuidar la `biblioteca_luterana` (Colección 01: el Instituto).
- Voz es-MX: mantén presionado el orbe y di *hola hans*, *biblioteca*, *siguiente*, *atrás*, *cierra*, *duerme*, *despierta*, *feliz*, *piensa*, *amor*.
- Modos: `?lib=1` · `?mode=live&skip=1` · `?genesis=1` · `?skip=1` · `?expr=happy&skip=1` · `?voice=0`.

## Cualquier tamaño · `<hans-face>`

Una sola cara que escala: `hans-face.js` (sin dependencias).

```html
<script src="https://lutheraninstitute.github.io/HANS/hans-face.js"></script>
<hans-face mood="ready" style="width:64px;height:64px"></hans-face>
```

- **< 40 px · æ**: la cara se pliega en la ligadura æ; la a y la e son sus ojos (también `favicon.svg`).
- **40–159 px · avatar**: orbe, ojos, boca y parpadeo.
- **≥ 160 px · full**: sigue el dedo/cursor y muestra moods; en caja 9:16 el rótulo va debajo, en 16:9 al lado.
- Moods: `ready` · `happy` · `think` · `surprise` · `sleep` · `love`. API: `el.mood = "happy"`, `el.say("hola")`.
- Demo de tamaños: `tamanos.html` · Primer trabajo, recepción del Diplomado en Transformación Digital (martes 7 pm Texas): `clase.html`.

## Por qué Hauge · lectura recomendada

**Ola Honningdal Grytten (NHH, 2020). _Puritan Motivation for Serial Entrepreneurship: The Haugean Example_.** NHH Dept. of Economics Discussion Paper 12/2020, 15 págs., acceso abierto: https://hdl.handle.net/11250/2671388

Resumen (en nuestras palabras, a partir del resumen y la introducción del autor):

- Hans Nielsen Hauge (1771–1824), hijo de campesinos de Rolvsøy (Østfold) y predicador laico, fue un **emprendedor en serie**: industria, comercio, transporte marítimo, finanzas e inversiones, pero también **educación, reformas políticas y obra social**. Grytten afirma que es difícil encontrar a alguien con un papel tan importante en la formación de la Noruega moderna.
- Su emprendimiento se modela como la suma de cinco frentes: religioso + industrial + político + educativo + de bienestar (EH = RE + IE + PE + EE + WE). Lo industrial combina capital, trabajo, finanzas, tecnología y mercados, todo multiplicado por un **factor de motivación**.
- Las fuentes son cartas comerciales y cuentas de puño y letra de Hauge, muchas usadas en el juicio en su contra, donde fue absuelto en lo referente a su actividad empresarial.
- Conclusión: Hauge y su red estuvieron fuertemente comprometidos con el emprendimiento en serie, dentro y fuera de los negocios, y **su motivación fue claramente religiosa**: la vocación vivida como trabajo, con las ganancias reinvertidas en lugar de consumidas.

Por qué importa para HANS: un laico sin título que fundaba negocios, escuelas y obra social a la vez es el modelo de #OSW, donde todos somos desarrolladores y la persona es la raíz. HANS lleva su nombre por eso.

Nombre de desarrollo: Enzo (ENZO_HARK), por Lorænzzo Méndez, un Cane Corso gris.

Read-only · DEMO · la cara muestra, no mueve ningún robot. Human stays root · Evidence ≠ Authority.

`>_æ:` Make something agents want.
