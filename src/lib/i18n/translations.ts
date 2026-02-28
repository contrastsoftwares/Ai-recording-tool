export interface Translations {
  // Navigation
  nav: {
    dashboard: string;
    myNotes: string;
    photoSolver: string;
    audioRecorder: string;
    screenRecording: string;
    settings: string;
    // Mobile short labels
    home: string;
    notes: string;
    photo: string;
    audio: string;
    screen: string;
  };
  // Sidebar
  sidebar: {
    brand: string;
    subtitle: string;
    collapse: string;
    expandSidebar: string;
    collapseSidebar: string;
  };
  // Header
  header: {
    searchPlaceholder: string;
    noNotesFound: string;
    notifications: string;
    userMenu: string;
    menu: string;
  };
  // Dashboard
  dashboard: {
    goodMorning: string;
    goodAfternoon: string;
    goodEvening: string;
    subtitle: string;
    totalNotes: string;
    favorites: string;
    withFlashcards: string;
    withTests: string;
    quickActions: string;
    recentNotes: string;
    viewAll: string;
    noNotesYet: string;
    noNotesDesc: string;
    // Quick actions
    uploadAndGenerate: string;
    uploadAndGenerateDesc: string;
    photoSolverAction: string;
    photoSolverDesc: string;
    recordScreen: string;
    recordScreenDesc: string;
    recordAudio: string;
    recordAudioDesc: string;
  };
  // Notes page
  notesPage: {
    title: string;
    noteCount: string;
    notesCount: string;
    createNew: string;
    searchPlaceholder: string;
    all: string;
    video: string;
    audio: string;
    pdf: string;
    link: string;
    image: string;
    document: string;
    favorites: string;
    newest: string;
    oldest: string;
    alphabetical: string;
    clearAll: string;
    noNotesFound: string;
    tryAdjusting: string;
    getStarted: string;
    createFirstNote: string;
  };
  // Note detail
  noteDetail: {
    notes: string;
    chat: string;
    flashcards: string;
    test: string;
    transcript: string;
    noteInfo: string;
    source: string;
    created: string;
    stats: string;
    words: string;
    tags: string;
    formats: string;
    actions: string;
    export: string;
    share: string;
    delete: string;
    noteNotFound: string;
    noteNotFoundDesc: string;
    backToDashboard: string;
    addToFavorites: string;
    removeFromFavorites: string;
  };
  // Create new note
  newNote: {
    title: string;
    subtitle: string;
    back: string;
    upload: string;
    format: string;
    processing: string;
    continueToFormat: string;
    source: string;
    generateNotes: string;
    generatingYourNotes: string;
    complete: string;
    notesGenerated: string;
    redirecting: string;
    extractingUrl: string;
    transcribing: string;
    extractingPdf: string;
    analyzingImage: string;
    readingDocument: string;
    generatingAiNotes: string;
    finalizingNotes: string;
  };
  // Settings
  settings: {
    title: string;
    subtitle: string;
    profile: string;
    profileDesc: string;
    profilePhoto: string;
    profilePhotoDesc: string;
    fullName: string;
    email: string;
    saveChanges: string;
    appearance: string;
    appearanceDesc: string;
    light: string;
    dark: string;
    notePreferences: string;
    notePreferencesDesc: string;
    defaultLanguage: string;
    defaultLanguageDesc: string;
    autoFlashcards: string;
    autoFlashcardsDesc: string;
    autoPracticeTests: string;
    autoPracticeTestsDesc: string;
    account: string;
    accountDesc: string;
    exportAllData: string;
    deleteAccount: string;
  };
  // Photo solver
  photoSolver: {
    title: string;
    subtitle: string;
    takeOrUpload: string;
    ofAnyProblem: string;
    uploadImage: string;
    takePhoto: string;
    imageUploaded: string;
    analyzing: string;
    analyzingSubtext: string;
    problem: string;
    stepByStep: string;
    askFollowUp: string;
    followUpPlaceholder: string;
    thinking: string;
  };
  // Audio recorder
  audioRecorder: {
    title: string;
    subtitle: string;
    recordingSaved: string;
    audioSaved: string;
    generateNotes: string;
    downloadRecording: string;
    newRecording: string;
    microphoneReady: string;
  };
  // Screen recorder
  screenRecorder: {
    title: string;
    subtitle: string;
    audioWarning: string;
    shareAudio: string;
    recordingSaved: string;
    screenSaved: string;
    generateNotes: string;
    downloadRecording: string;
    newRecording: string;
    screenPreview: string;
    recordingPaused: string;
    microphone: string;
    quality: string;
    systemAudioNote: string;
  };
  // Common
  common: {
    delete: string;
    cancel: string;
    save: string;
    back: string;
    confirmDelete: string;
  };
}

export type Language = "english" | "spanish" | "french" | "german" | "chinese" | "japanese" | "korean";

const en: Translations = {
  nav: {
    dashboard: "Dashboard",
    myNotes: "My Notes",
    photoSolver: "Photo Solver",
    audioRecorder: "Audio Recorder",
    screenRecording: "Screen Recording",
    settings: "Settings",
    home: "Home",
    notes: "Notes",
    photo: "Photo",
    audio: "Audio",
    screen: "Screen",
  },
  sidebar: {
    brand: "Contrast AI",
    subtitle: "AI Study Companion",
    collapse: "Collapse",
    expandSidebar: "Expand sidebar",
    collapseSidebar: "Collapse sidebar",
  },
  header: {
    searchPlaceholder: "Search notes, recordings...",
    noNotesFound: "No notes found for",
    notifications: "Notifications",
    userMenu: "User menu",
    menu: "Menu",
  },
  dashboard: {
    goodMorning: "Good morning!",
    goodAfternoon: "Good afternoon!",
    goodEvening: "Good evening!",
    subtitle: "Here's what's happening with your studies",
    totalNotes: "Total Notes",
    favorites: "Favorites",
    withFlashcards: "With Flashcards",
    withTests: "With Tests",
    quickActions: "Quick Actions",
    recentNotes: "Recent Notes",
    viewAll: "View All",
    noNotesYet: "No notes yet",
    noNotesDesc: "Upload a video, PDF, or audio file to generate your first AI-powered notes.",
    uploadAndGenerate: "Upload & Generate Notes",
    uploadAndGenerateDesc: "Upload videos, PDFs, audio files or paste a link to generate AI-powered notes",
    photoSolverAction: "Photo Solver",
    photoSolverDesc: "Snap a photo of a problem and get step-by-step solutions",
    recordScreen: "Record Screen",
    recordScreenDesc: "Capture your screen and generate notes from the recording",
    recordAudio: "Record Audio",
    recordAudioDesc: "Record lectures or conversations and transcribe them into notes",
  },
  notesPage: {
    title: "My Notes",
    noteCount: "note",
    notesCount: "notes",
    createNew: "Create New",
    searchPlaceholder: "Search notes by title, content, or tags...",
    all: "All",
    video: "Video",
    audio: "Audio",
    pdf: "PDF",
    link: "Link",
    image: "Image",
    document: "Document",
    favorites: "Favorites",
    newest: "Newest",
    oldest: "Oldest",
    alphabetical: "A-Z",
    clearAll: "Clear All",
    noNotesFound: "No notes found",
    tryAdjusting: "Try adjusting your filters or search query.",
    getStarted: "Get started by uploading a lecture, recording, or document.",
    createFirstNote: "Create Your First Note",
  },
  noteDetail: {
    notes: "Notes",
    chat: "Chat",
    flashcards: "Flashcards",
    test: "Test",
    transcript: "Transcript",
    noteInfo: "Note Info",
    source: "Source",
    created: "Created",
    stats: "Stats",
    words: "words",
    tags: "Tags",
    formats: "Formats",
    actions: "Actions",
    export: "Export",
    share: "Share",
    delete: "Delete",
    noteNotFound: "Note not found",
    noteNotFoundDesc: "The note you are looking for does not exist or has been removed.",
    backToDashboard: "Back to Dashboard",
    addToFavorites: "Add to favorites",
    removeFromFavorites: "Remove from favorites",
  },
  newNote: {
    title: "Create New Notes",
    subtitle: "Upload your content and let AI generate notes for you",
    back: "Back",
    upload: "Upload",
    format: "Format",
    processing: "Processing",
    continueToFormat: "Continue to Format Selection",
    source: "Source:",
    generateNotes: "Generate Notes",
    generatingYourNotes: "Generating Your Notes",
    complete: "complete",
    notesGenerated: "Notes Generated Successfully!",
    redirecting: "Redirecting to your new notes...",
    extractingUrl: "Extracting content from URL...",
    transcribing: "Transcribing your recording...",
    extractingPdf: "Extracting text from PDF...",
    analyzingImage: "Analyzing image...",
    readingDocument: "Reading document...",
    generatingAiNotes: "Generating AI-powered notes...",
    finalizingNotes: "Finalizing your notes...",
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your account settings and preferences.",
    profile: "Profile",
    profileDesc: "Your personal information and account details.",
    profilePhoto: "Profile Photo",
    profilePhotoDesc: "Click the edit button to change your avatar.",
    fullName: "Full Name",
    email: "Email",
    saveChanges: "Save Changes",
    appearance: "Appearance",
    appearanceDesc: "Customize the look and feel of the application.",
    light: "Light",
    dark: "Dark",
    notePreferences: "Note Preferences",
    notePreferencesDesc: "Configure how your AI-generated notes are created.",
    defaultLanguage: "Default Language",
    defaultLanguageDesc: "Language for generated notes and summaries.",
    autoFlashcards: "Auto-generate Flashcards",
    autoFlashcardsDesc: "Automatically create flashcards when notes are generated.",
    autoPracticeTests: "Auto-generate Practice Tests",
    autoPracticeTestsDesc: "Automatically create practice tests when notes are generated.",
    account: "Account",
    accountDesc: "Manage your account data and preferences.",
    exportAllData: "Export All Data",
    deleteAccount: "Delete Account",
  },
  photoSolver: {
    title: "Photo Solver",
    subtitle: "Take a photo or upload an image of any problem and get step-by-step solutions",
    takeOrUpload: "Take a photo or upload an image",
    ofAnyProblem: "of any math, science, or academic problem",
    uploadImage: "Upload Image",
    takePhoto: "Take Photo",
    imageUploaded: "Problem image uploaded",
    analyzing: "Analyzing your problem...",
    analyzingSubtext: "Using AI to identify and solve the problem",
    problem: "Problem",
    stepByStep: "Step-by-Step Solution",
    askFollowUp: "Ask a Follow-up Question",
    followUpPlaceholder: "e.g., Can you explain step 2 in more detail?",
    thinking: "Thinking...",
  },
  audioRecorder: {
    title: "Audio Recorder",
    subtitle: "Record audio and generate AI-powered notes from the recording.",
    recordingSaved: "Recording saved!",
    audioSaved: "Your audio recording has been saved successfully.",
    generateNotes: "Generate Notes",
    downloadRecording: "Download Recording",
    newRecording: "New Recording",
    microphoneReady: "Microphone ready",
  },
  screenRecorder: {
    title: "Screen Recording",
    subtitle: "Record your screen and generate AI-powered notes from the recording.",
    audioWarning: "Remember to check",
    shareAudio: "Share audio",
    recordingSaved: "Recording saved!",
    screenSaved: "Your screen recording has been saved successfully.",
    generateNotes: "Generate Notes",
    downloadRecording: "Download Recording",
    newRecording: "New Recording",
    screenPreview: "Your screen will appear here",
    recordingPaused: "Recording paused",
    microphone: "Microphone",
    quality: "Quality",
    systemAudioNote: "System/tab audio capture is requested by default. Toggle microphone above to also record your voice.",
  },
  common: {
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    back: "Back",
    confirmDelete: "This cannot be undone.",
  },
};

const es: Translations = {
  nav: {
    dashboard: "Panel",
    myNotes: "Mis Notas",
    photoSolver: "Resolver Foto",
    audioRecorder: "Grabadora",
    screenRecording: "Grabar Pantalla",
    settings: "Ajustes",
    home: "Inicio",
    notes: "Notas",
    photo: "Foto",
    audio: "Audio",
    screen: "Pantalla",
  },
  sidebar: {
    brand: "Contrast AI",
    subtitle: "Compañero de Estudio IA",
    collapse: "Colapsar",
    expandSidebar: "Expandir barra lateral",
    collapseSidebar: "Colapsar barra lateral",
  },
  header: {
    searchPlaceholder: "Buscar notas, grabaciones...",
    noNotesFound: "No se encontraron notas para",
    notifications: "Notificaciones",
    userMenu: "Menú de usuario",
    menu: "Menú",
  },
  dashboard: {
    goodMorning: "¡Buenos días!",
    goodAfternoon: "¡Buenas tardes!",
    goodEvening: "¡Buenas noches!",
    subtitle: "Esto es lo que está pasando con tus estudios",
    totalNotes: "Total de Notas",
    favorites: "Favoritos",
    withFlashcards: "Con Tarjetas",
    withTests: "Con Exámenes",
    quickActions: "Acciones Rápidas",
    recentNotes: "Notas Recientes",
    viewAll: "Ver Todo",
    noNotesYet: "Aún no hay notas",
    noNotesDesc: "Sube un video, PDF o archivo de audio para generar tus primeras notas con IA.",
    uploadAndGenerate: "Subir y Generar Notas",
    uploadAndGenerateDesc: "Sube videos, PDFs, archivos de audio o pega un enlace para generar notas con IA",
    photoSolverAction: "Resolver Foto",
    photoSolverDesc: "Toma una foto de un problema y obtén soluciones paso a paso",
    recordScreen: "Grabar Pantalla",
    recordScreenDesc: "Captura tu pantalla y genera notas de la grabación",
    recordAudio: "Grabar Audio",
    recordAudioDesc: "Graba clases o conversaciones y transcríbelas en notas",
  },
  notesPage: {
    title: "Mis Notas",
    noteCount: "nota",
    notesCount: "notas",
    createNew: "Crear Nueva",
    searchPlaceholder: "Buscar notas por título, contenido o etiquetas...",
    all: "Todas",
    video: "Video",
    audio: "Audio",
    pdf: "PDF",
    link: "Enlace",
    image: "Imagen",
    document: "Documento",
    favorites: "Favoritos",
    newest: "Más recientes",
    oldest: "Más antiguas",
    alphabetical: "A-Z",
    clearAll: "Limpiar Todo",
    noNotesFound: "No se encontraron notas",
    tryAdjusting: "Intenta ajustar tus filtros o búsqueda.",
    getStarted: "Comienza subiendo una clase, grabación o documento.",
    createFirstNote: "Crea Tu Primera Nota",
  },
  noteDetail: {
    notes: "Notas",
    chat: "Chat",
    flashcards: "Tarjetas",
    test: "Examen",
    transcript: "Transcripción",
    noteInfo: "Info de Nota",
    source: "Fuente",
    created: "Creado",
    stats: "Estadísticas",
    words: "palabras",
    tags: "Etiquetas",
    formats: "Formatos",
    actions: "Acciones",
    export: "Exportar",
    share: "Compartir",
    delete: "Eliminar",
    noteNotFound: "Nota no encontrada",
    noteNotFoundDesc: "La nota que buscas no existe o ha sido eliminada.",
    backToDashboard: "Volver al Panel",
    addToFavorites: "Añadir a favoritos",
    removeFromFavorites: "Quitar de favoritos",
  },
  newNote: {
    title: "Crear Nuevas Notas",
    subtitle: "Sube tu contenido y deja que la IA genere notas para ti",
    back: "Atrás",
    upload: "Subir",
    format: "Formato",
    processing: "Procesando",
    continueToFormat: "Continuar a Selección de Formato",
    source: "Fuente:",
    generateNotes: "Generar Notas",
    generatingYourNotes: "Generando Tus Notas",
    complete: "completo",
    notesGenerated: "¡Notas Generadas Exitosamente!",
    redirecting: "Redirigiendo a tus nuevas notas...",
    extractingUrl: "Extrayendo contenido de la URL...",
    transcribing: "Transcribiendo tu grabación...",
    extractingPdf: "Extrayendo texto del PDF...",
    analyzingImage: "Analizando imagen...",
    readingDocument: "Leyendo documento...",
    generatingAiNotes: "Generando notas con IA...",
    finalizingNotes: "Finalizando tus notas...",
  },
  settings: {
    title: "Ajustes",
    subtitle: "Administra la configuración de tu cuenta y preferencias.",
    profile: "Perfil",
    profileDesc: "Tu información personal y detalles de cuenta.",
    profilePhoto: "Foto de Perfil",
    profilePhotoDesc: "Haz clic en el botón de editar para cambiar tu avatar.",
    fullName: "Nombre Completo",
    email: "Correo Electrónico",
    saveChanges: "Guardar Cambios",
    appearance: "Apariencia",
    appearanceDesc: "Personaliza la apariencia de la aplicación.",
    light: "Claro",
    dark: "Oscuro",
    notePreferences: "Preferencias de Notas",
    notePreferencesDesc: "Configura cómo se crean tus notas generadas por IA.",
    defaultLanguage: "Idioma Predeterminado",
    defaultLanguageDesc: "Idioma para notas y resúmenes generados.",
    autoFlashcards: "Generar Tarjetas Automáticamente",
    autoFlashcardsDesc: "Crear tarjetas automáticamente cuando se generan notas.",
    autoPracticeTests: "Generar Exámenes Automáticamente",
    autoPracticeTestsDesc: "Crear exámenes automáticamente cuando se generan notas.",
    account: "Cuenta",
    accountDesc: "Administra los datos y preferencias de tu cuenta.",
    exportAllData: "Exportar Todos los Datos",
    deleteAccount: "Eliminar Cuenta",
  },
  photoSolver: {
    title: "Resolver Foto",
    subtitle: "Toma una foto o sube una imagen de cualquier problema y obtén soluciones paso a paso",
    takeOrUpload: "Toma una foto o sube una imagen",
    ofAnyProblem: "de cualquier problema de matemáticas, ciencias o académico",
    uploadImage: "Subir Imagen",
    takePhoto: "Tomar Foto",
    imageUploaded: "Imagen del problema subida",
    analyzing: "Analizando tu problema...",
    analyzingSubtext: "Usando IA para identificar y resolver el problema",
    problem: "Problema",
    stepByStep: "Solución Paso a Paso",
    askFollowUp: "Haz una Pregunta de Seguimiento",
    followUpPlaceholder: "ej., ¿Puedes explicar el paso 2 con más detalle?",
    thinking: "Pensando...",
  },
  audioRecorder: {
    title: "Grabadora de Audio",
    subtitle: "Graba audio y genera notas con IA de la grabación.",
    recordingSaved: "¡Grabación guardada!",
    audioSaved: "Tu grabación de audio se ha guardado exitosamente.",
    generateNotes: "Generar Notas",
    downloadRecording: "Descargar Grabación",
    newRecording: "Nueva Grabación",
    microphoneReady: "Micrófono listo",
  },
  screenRecorder: {
    title: "Grabación de Pantalla",
    subtitle: "Graba tu pantalla y genera notas con IA de la grabación.",
    audioWarning: "Recuerda marcar",
    shareAudio: "Compartir audio",
    recordingSaved: "¡Grabación guardada!",
    screenSaved: "Tu grabación de pantalla se ha guardado exitosamente.",
    generateNotes: "Generar Notas",
    downloadRecording: "Descargar Grabación",
    newRecording: "Nueva Grabación",
    screenPreview: "Tu pantalla aparecerá aquí",
    recordingPaused: "Grabación pausada",
    microphone: "Micrófono",
    quality: "Calidad",
    systemAudioNote: "La captura de audio del sistema/pestaña se solicita por defecto. Activa el micrófono arriba para también grabar tu voz.",
  },
  common: {
    delete: "Eliminar",
    cancel: "Cancelar",
    save: "Guardar",
    back: "Atrás",
    confirmDelete: "Esto no se puede deshacer.",
  },
};

const fr: Translations = {
  nav: {
    dashboard: "Tableau de bord",
    myNotes: "Mes Notes",
    photoSolver: "Résolveur Photo",
    audioRecorder: "Enregistreur Audio",
    screenRecording: "Enregistrement Écran",
    settings: "Paramètres",
    home: "Accueil",
    notes: "Notes",
    photo: "Photo",
    audio: "Audio",
    screen: "Écran",
  },
  sidebar: {
    brand: "Contrast AI",
    subtitle: "Compagnon d'Étude IA",
    collapse: "Réduire",
    expandSidebar: "Développer la barre latérale",
    collapseSidebar: "Réduire la barre latérale",
  },
  header: {
    searchPlaceholder: "Rechercher notes, enregistrements...",
    noNotesFound: "Aucune note trouvée pour",
    notifications: "Notifications",
    userMenu: "Menu utilisateur",
    menu: "Menu",
  },
  dashboard: {
    goodMorning: "Bonjour !",
    goodAfternoon: "Bon après-midi !",
    goodEvening: "Bonsoir !",
    subtitle: "Voici ce qui se passe avec vos études",
    totalNotes: "Total des Notes",
    favorites: "Favoris",
    withFlashcards: "Avec Cartes",
    withTests: "Avec Tests",
    quickActions: "Actions Rapides",
    recentNotes: "Notes Récentes",
    viewAll: "Voir Tout",
    noNotesYet: "Pas encore de notes",
    noNotesDesc: "Téléchargez une vidéo, un PDF ou un fichier audio pour générer vos premières notes IA.",
    uploadAndGenerate: "Télécharger et Générer des Notes",
    uploadAndGenerateDesc: "Téléchargez des vidéos, PDFs, fichiers audio ou collez un lien pour générer des notes IA",
    photoSolverAction: "Résolveur Photo",
    photoSolverDesc: "Prenez une photo d'un problème et obtenez des solutions étape par étape",
    recordScreen: "Enregistrer l'Écran",
    recordScreenDesc: "Capturez votre écran et générez des notes à partir de l'enregistrement",
    recordAudio: "Enregistrer Audio",
    recordAudioDesc: "Enregistrez des cours ou conversations et transcrivez-les en notes",
  },
  notesPage: {
    title: "Mes Notes",
    noteCount: "note",
    notesCount: "notes",
    createNew: "Créer",
    searchPlaceholder: "Rechercher des notes par titre, contenu ou tags...",
    all: "Toutes",
    video: "Vidéo",
    audio: "Audio",
    pdf: "PDF",
    link: "Lien",
    image: "Image",
    document: "Document",
    favorites: "Favoris",
    newest: "Plus récentes",
    oldest: "Plus anciennes",
    alphabetical: "A-Z",
    clearAll: "Tout Effacer",
    noNotesFound: "Aucune note trouvée",
    tryAdjusting: "Essayez d'ajuster vos filtres ou votre recherche.",
    getStarted: "Commencez en téléchargeant un cours, un enregistrement ou un document.",
    createFirstNote: "Créez Votre Première Note",
  },
  noteDetail: {
    notes: "Notes",
    chat: "Discussion",
    flashcards: "Cartes",
    test: "Test",
    transcript: "Transcription",
    noteInfo: "Info Note",
    source: "Source",
    created: "Créé",
    stats: "Statistiques",
    words: "mots",
    tags: "Tags",
    formats: "Formats",
    actions: "Actions",
    export: "Exporter",
    share: "Partager",
    delete: "Supprimer",
    noteNotFound: "Note introuvable",
    noteNotFoundDesc: "La note que vous recherchez n'existe pas ou a été supprimée.",
    backToDashboard: "Retour au Tableau de bord",
    addToFavorites: "Ajouter aux favoris",
    removeFromFavorites: "Retirer des favoris",
  },
  newNote: {
    title: "Créer de Nouvelles Notes",
    subtitle: "Téléchargez votre contenu et laissez l'IA générer des notes pour vous",
    back: "Retour",
    upload: "Télécharger",
    format: "Format",
    processing: "Traitement",
    continueToFormat: "Continuer vers la Sélection du Format",
    source: "Source :",
    generateNotes: "Générer les Notes",
    generatingYourNotes: "Génération de Vos Notes",
    complete: "terminé",
    notesGenerated: "Notes Générées avec Succès !",
    redirecting: "Redirection vers vos nouvelles notes...",
    extractingUrl: "Extraction du contenu de l'URL...",
    transcribing: "Transcription de votre enregistrement...",
    extractingPdf: "Extraction du texte du PDF...",
    analyzingImage: "Analyse de l'image...",
    readingDocument: "Lecture du document...",
    generatingAiNotes: "Génération de notes IA...",
    finalizingNotes: "Finalisation de vos notes...",
  },
  settings: {
    title: "Paramètres",
    subtitle: "Gérez les paramètres et préférences de votre compte.",
    profile: "Profil",
    profileDesc: "Vos informations personnelles et détails du compte.",
    profilePhoto: "Photo de Profil",
    profilePhotoDesc: "Cliquez sur le bouton modifier pour changer votre avatar.",
    fullName: "Nom Complet",
    email: "E-mail",
    saveChanges: "Enregistrer",
    appearance: "Apparence",
    appearanceDesc: "Personnalisez l'apparence de l'application.",
    light: "Clair",
    dark: "Sombre",
    notePreferences: "Préférences de Notes",
    notePreferencesDesc: "Configurez comment vos notes générées par IA sont créées.",
    defaultLanguage: "Langue par Défaut",
    defaultLanguageDesc: "Langue pour les notes et résumés générés.",
    autoFlashcards: "Générer les Cartes Automatiquement",
    autoFlashcardsDesc: "Créer automatiquement des cartes lorsque les notes sont générées.",
    autoPracticeTests: "Générer les Tests Automatiquement",
    autoPracticeTestsDesc: "Créer automatiquement des tests lorsque les notes sont générées.",
    account: "Compte",
    accountDesc: "Gérez les données et préférences de votre compte.",
    exportAllData: "Exporter Toutes les Données",
    deleteAccount: "Supprimer le Compte",
  },
  photoSolver: {
    title: "Résolveur Photo",
    subtitle: "Prenez une photo ou téléchargez une image de n'importe quel problème et obtenez des solutions étape par étape",
    takeOrUpload: "Prenez une photo ou téléchargez une image",
    ofAnyProblem: "de n'importe quel problème de maths, sciences ou académique",
    uploadImage: "Télécharger Image",
    takePhoto: "Prendre Photo",
    imageUploaded: "Image du problème téléchargée",
    analyzing: "Analyse de votre problème...",
    analyzingSubtext: "Utilisation de l'IA pour identifier et résoudre le problème",
    problem: "Problème",
    stepByStep: "Solution Étape par Étape",
    askFollowUp: "Posez une Question de Suivi",
    followUpPlaceholder: "ex., Pouvez-vous expliquer l'étape 2 plus en détail ?",
    thinking: "Réflexion...",
  },
  audioRecorder: {
    title: "Enregistreur Audio",
    subtitle: "Enregistrez de l'audio et générez des notes IA à partir de l'enregistrement.",
    recordingSaved: "Enregistrement sauvegardé !",
    audioSaved: "Votre enregistrement audio a été sauvegardé avec succès.",
    generateNotes: "Générer les Notes",
    downloadRecording: "Télécharger l'Enregistrement",
    newRecording: "Nouvel Enregistrement",
    microphoneReady: "Microphone prêt",
  },
  screenRecorder: {
    title: "Enregistrement d'Écran",
    subtitle: "Enregistrez votre écran et générez des notes IA à partir de l'enregistrement.",
    audioWarning: "N'oubliez pas de cocher",
    shareAudio: "Partager l'audio",
    recordingSaved: "Enregistrement sauvegardé !",
    screenSaved: "Votre enregistrement d'écran a été sauvegardé avec succès.",
    generateNotes: "Générer les Notes",
    downloadRecording: "Télécharger l'Enregistrement",
    newRecording: "Nouvel Enregistrement",
    screenPreview: "Votre écran apparaîtra ici",
    recordingPaused: "Enregistrement en pause",
    microphone: "Microphone",
    quality: "Qualité",
    systemAudioNote: "La capture audio du système/onglet est demandée par défaut. Activez le microphone ci-dessus pour aussi enregistrer votre voix.",
  },
  common: {
    delete: "Supprimer",
    cancel: "Annuler",
    save: "Enregistrer",
    back: "Retour",
    confirmDelete: "Cette action est irréversible.",
  },
};

const de: Translations = {
  nav: {
    dashboard: "Dashboard",
    myNotes: "Meine Notizen",
    photoSolver: "Foto-Löser",
    audioRecorder: "Audiorekorder",
    screenRecording: "Bildschirmaufnahme",
    settings: "Einstellungen",
    home: "Start",
    notes: "Notizen",
    photo: "Foto",
    audio: "Audio",
    screen: "Bildschirm",
  },
  sidebar: {
    brand: "Contrast AI",
    subtitle: "KI-Lernbegleiter",
    collapse: "Einklappen",
    expandSidebar: "Seitenleiste erweitern",
    collapseSidebar: "Seitenleiste einklappen",
  },
  header: {
    searchPlaceholder: "Notizen, Aufnahmen suchen...",
    noNotesFound: "Keine Notizen gefunden für",
    notifications: "Benachrichtigungen",
    userMenu: "Benutzermenü",
    menu: "Menü",
  },
  dashboard: {
    goodMorning: "Guten Morgen!",
    goodAfternoon: "Guten Tag!",
    goodEvening: "Guten Abend!",
    subtitle: "Hier ist, was mit deinen Studien passiert",
    totalNotes: "Gesamt Notizen",
    favorites: "Favoriten",
    withFlashcards: "Mit Karteikarten",
    withTests: "Mit Tests",
    quickActions: "Schnellaktionen",
    recentNotes: "Neueste Notizen",
    viewAll: "Alle Anzeigen",
    noNotesYet: "Noch keine Notizen",
    noNotesDesc: "Lade ein Video, PDF oder eine Audiodatei hoch, um deine ersten KI-Notizen zu erstellen.",
    uploadAndGenerate: "Hochladen & Notizen Erstellen",
    uploadAndGenerateDesc: "Lade Videos, PDFs, Audiodateien hoch oder füge einen Link ein, um KI-Notizen zu erstellen",
    photoSolverAction: "Foto-Löser",
    photoSolverDesc: "Mach ein Foto von einem Problem und erhalte schrittweise Lösungen",
    recordScreen: "Bildschirm Aufnehmen",
    recordScreenDesc: "Nimm deinen Bildschirm auf und erstelle Notizen aus der Aufnahme",
    recordAudio: "Audio Aufnehmen",
    recordAudioDesc: "Nimm Vorlesungen oder Gespräche auf und transkribiere sie in Notizen",
  },
  notesPage: {
    title: "Meine Notizen",
    noteCount: "Notiz",
    notesCount: "Notizen",
    createNew: "Neu Erstellen",
    searchPlaceholder: "Notizen nach Titel, Inhalt oder Tags suchen...",
    all: "Alle",
    video: "Video",
    audio: "Audio",
    pdf: "PDF",
    link: "Link",
    image: "Bild",
    document: "Dokument",
    favorites: "Favoriten",
    newest: "Neueste",
    oldest: "Älteste",
    alphabetical: "A-Z",
    clearAll: "Alle Löschen",
    noNotesFound: "Keine Notizen gefunden",
    tryAdjusting: "Versuche, deine Filter oder Suche anzupassen.",
    getStarted: "Beginne, indem du eine Vorlesung, Aufnahme oder ein Dokument hochlädst.",
    createFirstNote: "Erstelle Deine Erste Notiz",
  },
  noteDetail: {
    notes: "Notizen",
    chat: "Chat",
    flashcards: "Karteikarten",
    test: "Test",
    transcript: "Transkript",
    noteInfo: "Notiz-Info",
    source: "Quelle",
    created: "Erstellt",
    stats: "Statistiken",
    words: "Wörter",
    tags: "Tags",
    formats: "Formate",
    actions: "Aktionen",
    export: "Exportieren",
    share: "Teilen",
    delete: "Löschen",
    noteNotFound: "Notiz nicht gefunden",
    noteNotFoundDesc: "Die gesuchte Notiz existiert nicht oder wurde entfernt.",
    backToDashboard: "Zurück zum Dashboard",
    addToFavorites: "Zu Favoriten hinzufügen",
    removeFromFavorites: "Aus Favoriten entfernen",
  },
  newNote: {
    title: "Neue Notizen Erstellen",
    subtitle: "Lade deinen Inhalt hoch und lass die KI Notizen für dich erstellen",
    back: "Zurück",
    upload: "Hochladen",
    format: "Format",
    processing: "Verarbeitung",
    continueToFormat: "Weiter zur Formatauswahl",
    source: "Quelle:",
    generateNotes: "Notizen Erstellen",
    generatingYourNotes: "Notizen werden erstellt",
    complete: "abgeschlossen",
    notesGenerated: "Notizen erfolgreich erstellt!",
    redirecting: "Weiterleitung zu deinen neuen Notizen...",
    extractingUrl: "Inhalte von URL extrahieren...",
    transcribing: "Aufnahme wird transkribiert...",
    extractingPdf: "Text aus PDF extrahieren...",
    analyzingImage: "Bild wird analysiert...",
    readingDocument: "Dokument wird gelesen...",
    generatingAiNotes: "KI-Notizen werden erstellt...",
    finalizingNotes: "Notizen werden finalisiert...",
  },
  settings: {
    title: "Einstellungen",
    subtitle: "Verwalte deine Kontoeinstellungen und Präferenzen.",
    profile: "Profil",
    profileDesc: "Deine persönlichen Informationen und Kontodaten.",
    profilePhoto: "Profilbild",
    profilePhotoDesc: "Klicke auf die Bearbeiten-Schaltfläche, um dein Avatar zu ändern.",
    fullName: "Vollständiger Name",
    email: "E-Mail",
    saveChanges: "Änderungen Speichern",
    appearance: "Erscheinungsbild",
    appearanceDesc: "Passe das Aussehen der Anwendung an.",
    light: "Hell",
    dark: "Dunkel",
    notePreferences: "Notiz-Einstellungen",
    notePreferencesDesc: "Konfiguriere, wie deine KI-generierten Notizen erstellt werden.",
    defaultLanguage: "Standardsprache",
    defaultLanguageDesc: "Sprache für generierte Notizen und Zusammenfassungen.",
    autoFlashcards: "Karteikarten automatisch erstellen",
    autoFlashcardsDesc: "Erstelle automatisch Karteikarten, wenn Notizen generiert werden.",
    autoPracticeTests: "Übungstests automatisch erstellen",
    autoPracticeTestsDesc: "Erstelle automatisch Tests, wenn Notizen generiert werden.",
    account: "Konto",
    accountDesc: "Verwalte deine Kontodaten und Präferenzen.",
    exportAllData: "Alle Daten Exportieren",
    deleteAccount: "Konto Löschen",
  },
  photoSolver: {
    title: "Foto-Löser",
    subtitle: "Mach ein Foto oder lade ein Bild von einem Problem hoch und erhalte schrittweise Lösungen",
    takeOrUpload: "Mach ein Foto oder lade ein Bild hoch",
    ofAnyProblem: "von jedem Mathe-, Naturwissenschafts- oder akademischen Problem",
    uploadImage: "Bild Hochladen",
    takePhoto: "Foto Machen",
    imageUploaded: "Problembild hochgeladen",
    analyzing: "Problem wird analysiert...",
    analyzingSubtext: "KI wird verwendet, um das Problem zu identifizieren und zu lösen",
    problem: "Problem",
    stepByStep: "Schritt-für-Schritt Lösung",
    askFollowUp: "Stelle eine Folgefrage",
    followUpPlaceholder: "z.B., Können Sie Schritt 2 genauer erklären?",
    thinking: "Denke nach...",
  },
  audioRecorder: {
    title: "Audiorekorder",
    subtitle: "Nimm Audio auf und erstelle KI-Notizen aus der Aufnahme.",
    recordingSaved: "Aufnahme gespeichert!",
    audioSaved: "Deine Audioaufnahme wurde erfolgreich gespeichert.",
    generateNotes: "Notizen Erstellen",
    downloadRecording: "Aufnahme Herunterladen",
    newRecording: "Neue Aufnahme",
    microphoneReady: "Mikrofon bereit",
  },
  screenRecorder: {
    title: "Bildschirmaufnahme",
    subtitle: "Nimm deinen Bildschirm auf und erstelle KI-Notizen aus der Aufnahme.",
    audioWarning: "Denke daran,",
    shareAudio: "Audio teilen",
    recordingSaved: "Aufnahme gespeichert!",
    screenSaved: "Deine Bildschirmaufnahme wurde erfolgreich gespeichert.",
    generateNotes: "Notizen Erstellen",
    downloadRecording: "Aufnahme Herunterladen",
    newRecording: "Neue Aufnahme",
    screenPreview: "Dein Bildschirm wird hier angezeigt",
    recordingPaused: "Aufnahme pausiert",
    microphone: "Mikrofon",
    quality: "Qualität",
    systemAudioNote: "System-/Tab-Audioaufnahme wird standardmäßig angefordert. Aktiviere das Mikrofon oben, um auch deine Stimme aufzunehmen.",
  },
  common: {
    delete: "Löschen",
    cancel: "Abbrechen",
    save: "Speichern",
    back: "Zurück",
    confirmDelete: "Dies kann nicht rückgängig gemacht werden.",
  },
};

const zh: Translations = {
  nav: {
    dashboard: "仪表盘",
    myNotes: "我的笔记",
    photoSolver: "拍照解题",
    audioRecorder: "录音机",
    screenRecording: "屏幕录制",
    settings: "设置",
    home: "首页",
    notes: "笔记",
    photo: "拍照",
    audio: "录音",
    screen: "录屏",
  },
  sidebar: {
    brand: "Contrast AI",
    subtitle: "AI学习伙伴",
    collapse: "收起",
    expandSidebar: "展开侧边栏",
    collapseSidebar: "收起侧边栏",
  },
  header: {
    searchPlaceholder: "搜索笔记、录音...",
    noNotesFound: "未找到相关笔记",
    notifications: "通知",
    userMenu: "用户菜单",
    menu: "菜单",
  },
  dashboard: {
    goodMorning: "早上好！",
    goodAfternoon: "下午好！",
    goodEvening: "晚上好！",
    subtitle: "这是你的学习动态",
    totalNotes: "总笔记数",
    favorites: "收藏",
    withFlashcards: "含闪卡",
    withTests: "含测试",
    quickActions: "快捷操作",
    recentNotes: "最近的笔记",
    viewAll: "查看全部",
    noNotesYet: "还没有笔记",
    noNotesDesc: "上传视频、PDF或音频文件来生成你的第一份AI笔记。",
    uploadAndGenerate: "上传并生成笔记",
    uploadAndGenerateDesc: "上传视频、PDF、音频文件或粘贴链接来生成AI笔记",
    photoSolverAction: "拍照解题",
    photoSolverDesc: "拍一张问题的照片，获取逐步解答",
    recordScreen: "录制屏幕",
    recordScreenDesc: "录制屏幕并从录制内容生成笔记",
    recordAudio: "录制音频",
    recordAudioDesc: "录制讲座或对话并转录为笔记",
  },
  notesPage: {
    title: "我的笔记",
    noteCount: "条笔记",
    notesCount: "条笔记",
    createNew: "新建",
    searchPlaceholder: "按标题、内容或标签搜索笔记...",
    all: "全部",
    video: "视频",
    audio: "音频",
    pdf: "PDF",
    link: "链接",
    image: "图片",
    document: "文档",
    favorites: "收藏",
    newest: "最新",
    oldest: "最早",
    alphabetical: "A-Z",
    clearAll: "清除全部",
    noNotesFound: "未找到笔记",
    tryAdjusting: "请尝试调整筛选条件或搜索关键词。",
    getStarted: "上传讲座、录音或文档开始使用。",
    createFirstNote: "创建你的第一条笔记",
  },
  noteDetail: {
    notes: "笔记",
    chat: "对话",
    flashcards: "闪卡",
    test: "测试",
    transcript: "转录",
    noteInfo: "笔记信息",
    source: "来源",
    created: "创建时间",
    stats: "统计",
    words: "字",
    tags: "标签",
    formats: "格式",
    actions: "操作",
    export: "导出",
    share: "分享",
    delete: "删除",
    noteNotFound: "未找到笔记",
    noteNotFoundDesc: "你要找的笔记不存在或已被删除。",
    backToDashboard: "返回仪表盘",
    addToFavorites: "添加到收藏",
    removeFromFavorites: "取消收藏",
  },
  newNote: {
    title: "创建新笔记",
    subtitle: "上传你的内容，让AI为你生成笔记",
    back: "返回",
    upload: "上传",
    format: "格式",
    processing: "处理中",
    continueToFormat: "继续选择格式",
    source: "来源：",
    generateNotes: "生成笔记",
    generatingYourNotes: "正在生成你的笔记",
    complete: "完成",
    notesGenerated: "笔记生成成功！",
    redirecting: "正在跳转到你的新笔记...",
    extractingUrl: "正在从URL提取内容...",
    transcribing: "正在转录你的录音...",
    extractingPdf: "正在从PDF提取文字...",
    analyzingImage: "正在分析图片...",
    readingDocument: "正在读取文档...",
    generatingAiNotes: "正在生成AI笔记...",
    finalizingNotes: "正在完成你的笔记...",
  },
  settings: {
    title: "设置",
    subtitle: "管理你的账户设置和偏好。",
    profile: "个人资料",
    profileDesc: "你的个人信息和账户详情。",
    profilePhoto: "头像",
    profilePhotoDesc: "点击编辑按钮更换头像。",
    fullName: "全名",
    email: "邮箱",
    saveChanges: "保存更改",
    appearance: "外观",
    appearanceDesc: "自定义应用的外观和感觉。",
    light: "浅色",
    dark: "深色",
    notePreferences: "笔记偏好",
    notePreferencesDesc: "配置AI生成笔记的方式。",
    defaultLanguage: "默认语言",
    defaultLanguageDesc: "生成笔记和摘要的语言。",
    autoFlashcards: "自动生成闪卡",
    autoFlashcardsDesc: "生成笔记时自动创建闪卡。",
    autoPracticeTests: "自动生成练习测试",
    autoPracticeTestsDesc: "生成笔记时自动创建练习测试。",
    account: "账户",
    accountDesc: "管理你的账户数据和偏好。",
    exportAllData: "导出所有数据",
    deleteAccount: "删除账户",
  },
  photoSolver: {
    title: "拍照解题",
    subtitle: "拍一张照片或上传任何问题的图片，获取逐步解答",
    takeOrUpload: "拍照或上传图片",
    ofAnyProblem: "任何数学、科学或学术问题",
    uploadImage: "上传图片",
    takePhoto: "拍照",
    imageUploaded: "问题图片已上传",
    analyzing: "正在分析你的问题...",
    analyzingSubtext: "使用AI识别并解决问题",
    problem: "问题",
    stepByStep: "逐步解答",
    askFollowUp: "提出后续问题",
    followUpPlaceholder: "例如：能更详细地解释第2步吗？",
    thinking: "思考中...",
  },
  audioRecorder: {
    title: "录音机",
    subtitle: "录制音频并从录音生成AI笔记。",
    recordingSaved: "录音已保存！",
    audioSaved: "你的音频录制已成功保存。",
    generateNotes: "生成笔记",
    downloadRecording: "下载录音",
    newRecording: "新录音",
    microphoneReady: "麦克风就绪",
  },
  screenRecorder: {
    title: "屏幕录制",
    subtitle: "录制屏幕并从录制内容生成AI笔记。",
    audioWarning: "记得勾选",
    shareAudio: "共享音频",
    recordingSaved: "录制已保存！",
    screenSaved: "你的屏幕录制已成功保存。",
    generateNotes: "生成笔记",
    downloadRecording: "下载录制",
    newRecording: "新录制",
    screenPreview: "你的屏幕将显示在此处",
    recordingPaused: "录制已暂停",
    microphone: "麦克风",
    quality: "画质",
    systemAudioNote: "默认请求系统/标签页音频捕获。开启上方麦克风以同时录制你的声音。",
  },
  common: {
    delete: "删除",
    cancel: "取消",
    save: "保存",
    back: "返回",
    confirmDelete: "此操作无法撤销。",
  },
};

const ja: Translations = {
  nav: {
    dashboard: "ダッシュボード",
    myNotes: "マイノート",
    photoSolver: "写真ソルバー",
    audioRecorder: "音声レコーダー",
    screenRecording: "画面録画",
    settings: "設定",
    home: "ホーム",
    notes: "ノート",
    photo: "写真",
    audio: "音声",
    screen: "画面",
  },
  sidebar: {
    brand: "Contrast AI",
    subtitle: "AI学習パートナー",
    collapse: "折りたたむ",
    expandSidebar: "サイドバーを展開",
    collapseSidebar: "サイドバーを折りたたむ",
  },
  header: {
    searchPlaceholder: "ノート、録音を検索...",
    noNotesFound: "ノートが見つかりません",
    notifications: "通知",
    userMenu: "ユーザーメニュー",
    menu: "メニュー",
  },
  dashboard: {
    goodMorning: "おはようございます！",
    goodAfternoon: "こんにちは！",
    goodEvening: "こんばんは！",
    subtitle: "あなたの学習の状況です",
    totalNotes: "ノート合計",
    favorites: "お気に入り",
    withFlashcards: "フラッシュカード付き",
    withTests: "テスト付き",
    quickActions: "クイックアクション",
    recentNotes: "最近のノート",
    viewAll: "すべて見る",
    noNotesYet: "まだノートがありません",
    noNotesDesc: "動画、PDF、または音声ファイルをアップロードして、最初のAIノートを作成しましょう。",
    uploadAndGenerate: "アップロード＆ノート生成",
    uploadAndGenerateDesc: "動画、PDF、音声ファイルをアップロードまたはリンクを貼り付けてAIノートを生成",
    photoSolverAction: "写真ソルバー",
    photoSolverDesc: "問題の写真を撮って、ステップバイステップの解答を取得",
    recordScreen: "画面を録画",
    recordScreenDesc: "画面を録画して、録画からノートを生成",
    recordAudio: "音声を録音",
    recordAudioDesc: "講義や会話を録音してノートに変換",
  },
  notesPage: {
    title: "マイノート",
    noteCount: "件のノート",
    notesCount: "件のノート",
    createNew: "新規作成",
    searchPlaceholder: "タイトル、内容、タグでノートを検索...",
    all: "すべて",
    video: "動画",
    audio: "音声",
    pdf: "PDF",
    link: "リンク",
    image: "画像",
    document: "ドキュメント",
    favorites: "お気に入り",
    newest: "新しい順",
    oldest: "古い順",
    alphabetical: "A-Z",
    clearAll: "すべてクリア",
    noNotesFound: "ノートが見つかりません",
    tryAdjusting: "フィルターや検索条件を調整してみてください。",
    getStarted: "講義、録音、またはドキュメントをアップロードして始めましょう。",
    createFirstNote: "最初のノートを作成",
  },
  noteDetail: {
    notes: "ノート",
    chat: "チャット",
    flashcards: "フラッシュカード",
    test: "テスト",
    transcript: "文字起こし",
    noteInfo: "ノート情報",
    source: "ソース",
    created: "作成日",
    stats: "統計",
    words: "語",
    tags: "タグ",
    formats: "フォーマット",
    actions: "アクション",
    export: "エクスポート",
    share: "共有",
    delete: "削除",
    noteNotFound: "ノートが見つかりません",
    noteNotFoundDesc: "お探しのノートは存在しないか、削除されています。",
    backToDashboard: "ダッシュボードに戻る",
    addToFavorites: "お気に入りに追加",
    removeFromFavorites: "お気に入りから削除",
  },
  newNote: {
    title: "新しいノートを作成",
    subtitle: "コンテンツをアップロードして、AIにノートを作成してもらいましょう",
    back: "戻る",
    upload: "アップロード",
    format: "フォーマット",
    processing: "処理中",
    continueToFormat: "フォーマット選択へ進む",
    source: "ソース：",
    generateNotes: "ノート生成",
    generatingYourNotes: "ノートを生成中",
    complete: "完了",
    notesGenerated: "ノートの生成に成功しました！",
    redirecting: "新しいノートにリダイレクト中...",
    extractingUrl: "URLからコンテンツを抽出中...",
    transcribing: "録音を文字起こし中...",
    extractingPdf: "PDFからテキストを抽出中...",
    analyzingImage: "画像を分析中...",
    readingDocument: "ドキュメントを読み取り中...",
    generatingAiNotes: "AIノートを生成中...",
    finalizingNotes: "ノートを仕上げ中...",
  },
  settings: {
    title: "設定",
    subtitle: "アカウント設定と環境設定を管理します。",
    profile: "プロフィール",
    profileDesc: "個人情報とアカウントの詳細。",
    profilePhoto: "プロフィール写真",
    profilePhotoDesc: "編集ボタンをクリックしてアバターを変更します。",
    fullName: "氏名",
    email: "メールアドレス",
    saveChanges: "変更を保存",
    appearance: "外観",
    appearanceDesc: "アプリケーションの外観をカスタマイズします。",
    light: "ライト",
    dark: "ダーク",
    notePreferences: "ノート設定",
    notePreferencesDesc: "AI生成ノートの作成方法を設定します。",
    defaultLanguage: "デフォルト言語",
    defaultLanguageDesc: "生成されるノートとサマリーの言語。",
    autoFlashcards: "フラッシュカードを自動生成",
    autoFlashcardsDesc: "ノート生成時にフラッシュカードを自動作成。",
    autoPracticeTests: "練習テストを自動生成",
    autoPracticeTestsDesc: "ノート生成時に練習テストを自動作成。",
    account: "アカウント",
    accountDesc: "アカウントデータと設定を管理します。",
    exportAllData: "すべてのデータをエクスポート",
    deleteAccount: "アカウントを削除",
  },
  photoSolver: {
    title: "写真ソルバー",
    subtitle: "問題の写真を撮るか画像をアップロードして、ステップバイステップの解答を取得",
    takeOrUpload: "写真を撮るか画像をアップロード",
    ofAnyProblem: "数学、科学、または学術的な問題",
    uploadImage: "画像をアップロード",
    takePhoto: "写真を撮る",
    imageUploaded: "問題の画像がアップロードされました",
    analyzing: "問題を分析中...",
    analyzingSubtext: "AIを使用して問題を特定し解決中",
    problem: "問題",
    stepByStep: "ステップバイステップの解答",
    askFollowUp: "追加の質問をする",
    followUpPlaceholder: "例：ステップ2をもっと詳しく説明してもらえますか？",
    thinking: "考え中...",
  },
  audioRecorder: {
    title: "音声レコーダー",
    subtitle: "音声を録音してAIノートを生成します。",
    recordingSaved: "録音が保存されました！",
    audioSaved: "音声録音が正常に保存されました。",
    generateNotes: "ノートを生成",
    downloadRecording: "録音をダウンロード",
    newRecording: "新しい録音",
    microphoneReady: "マイク準備完了",
  },
  screenRecorder: {
    title: "画面録画",
    subtitle: "画面を録画してAIノートを生成します。",
    audioWarning: "忘れずに",
    shareAudio: "音声を共有",
    recordingSaved: "録画が保存されました！",
    screenSaved: "画面録画が正常に保存されました。",
    generateNotes: "ノートを生成",
    downloadRecording: "録画をダウンロード",
    newRecording: "新しい録画",
    screenPreview: "ここに画面が表示されます",
    recordingPaused: "録画が一時停止中",
    microphone: "マイク",
    quality: "画質",
    systemAudioNote: "デフォルトでシステム/タブの音声キャプチャが要求されます。上のマイクをオンにして、自分の声も録音できます。",
  },
  common: {
    delete: "削除",
    cancel: "キャンセル",
    save: "保存",
    back: "戻る",
    confirmDelete: "この操作は取り消せません。",
  },
};

const ko: Translations = {
  nav: {
    dashboard: "대시보드",
    myNotes: "내 노트",
    photoSolver: "사진 풀이",
    audioRecorder: "오디오 녹음",
    screenRecording: "화면 녹화",
    settings: "설정",
    home: "홈",
    notes: "노트",
    photo: "사진",
    audio: "오디오",
    screen: "화면",
  },
  sidebar: {
    brand: "Contrast AI",
    subtitle: "AI 학습 도우미",
    collapse: "접기",
    expandSidebar: "사이드바 펼치기",
    collapseSidebar: "사이드바 접기",
  },
  header: {
    searchPlaceholder: "노트, 녹음 검색...",
    noNotesFound: "노트를 찾을 수 없습니다",
    notifications: "알림",
    userMenu: "사용자 메뉴",
    menu: "메뉴",
  },
  dashboard: {
    goodMorning: "좋은 아침입니다!",
    goodAfternoon: "좋은 오후입니다!",
    goodEvening: "좋은 저녁입니다!",
    subtitle: "학습 현황입니다",
    totalNotes: "전체 노트",
    favorites: "즐겨찾기",
    withFlashcards: "플래시카드 포함",
    withTests: "테스트 포함",
    quickActions: "빠른 작업",
    recentNotes: "최근 노트",
    viewAll: "전체 보기",
    noNotesYet: "아직 노트가 없습니다",
    noNotesDesc: "동영상, PDF 또는 오디오 파일을 업로드하여 첫 번째 AI 노트를 만들어 보세요.",
    uploadAndGenerate: "업로드 및 노트 생성",
    uploadAndGenerateDesc: "동영상, PDF, 오디오 파일을 업로드하거나 링크를 붙여넣어 AI 노트를 생성하세요",
    photoSolverAction: "사진 풀이",
    photoSolverDesc: "문제 사진을 찍어 단계별 풀이를 받으세요",
    recordScreen: "화면 녹화",
    recordScreenDesc: "화면을 녹화하고 녹화에서 노트를 생성하세요",
    recordAudio: "오디오 녹음",
    recordAudioDesc: "강의나 대화를 녹음하고 노트로 변환하세요",
  },
  notesPage: {
    title: "내 노트",
    noteCount: "개 노트",
    notesCount: "개 노트",
    createNew: "새로 만들기",
    searchPlaceholder: "제목, 내용 또는 태그로 노트 검색...",
    all: "전체",
    video: "동영상",
    audio: "오디오",
    pdf: "PDF",
    link: "링크",
    image: "이미지",
    document: "문서",
    favorites: "즐겨찾기",
    newest: "최신순",
    oldest: "오래된순",
    alphabetical: "가나다순",
    clearAll: "전체 삭제",
    noNotesFound: "노트를 찾을 수 없습니다",
    tryAdjusting: "필터나 검색어를 조정해 보세요.",
    getStarted: "강의, 녹음 또는 문서를 업로드하여 시작하세요.",
    createFirstNote: "첫 번째 노트 만들기",
  },
  noteDetail: {
    notes: "노트",
    chat: "채팅",
    flashcards: "플래시카드",
    test: "테스트",
    transcript: "녹취록",
    noteInfo: "노트 정보",
    source: "출처",
    created: "생성일",
    stats: "통계",
    words: "단어",
    tags: "태그",
    formats: "형식",
    actions: "작업",
    export: "내보내기",
    share: "공유",
    delete: "삭제",
    noteNotFound: "노트를 찾을 수 없습니다",
    noteNotFoundDesc: "찾고 있는 노트가 존재하지 않거나 삭제되었습니다.",
    backToDashboard: "대시보드로 돌아가기",
    addToFavorites: "즐겨찾기에 추가",
    removeFromFavorites: "즐겨찾기에서 제거",
  },
  newNote: {
    title: "새 노트 만들기",
    subtitle: "콘텐츠를 업로드하면 AI가 노트를 생성해 드립니다",
    back: "뒤로",
    upload: "업로드",
    format: "형식",
    processing: "처리 중",
    continueToFormat: "형식 선택으로 계속",
    source: "출처:",
    generateNotes: "노트 생성",
    generatingYourNotes: "노트 생성 중",
    complete: "완료",
    notesGenerated: "노트가 성공적으로 생성되었습니다!",
    redirecting: "새 노트로 이동 중...",
    extractingUrl: "URL에서 콘텐츠 추출 중...",
    transcribing: "녹음 전사 중...",
    extractingPdf: "PDF에서 텍스트 추출 중...",
    analyzingImage: "이미지 분석 중...",
    readingDocument: "문서 읽는 중...",
    generatingAiNotes: "AI 노트 생성 중...",
    finalizingNotes: "노트 마무리 중...",
  },
  settings: {
    title: "설정",
    subtitle: "계정 설정 및 환경설정을 관리합니다.",
    profile: "프로필",
    profileDesc: "개인 정보 및 계정 상세 정보.",
    profilePhoto: "프로필 사진",
    profilePhotoDesc: "편집 버튼을 클릭하여 아바타를 변경하세요.",
    fullName: "이름",
    email: "이메일",
    saveChanges: "변경사항 저장",
    appearance: "외관",
    appearanceDesc: "애플리케이션의 외관을 커스터마이즈합니다.",
    light: "라이트",
    dark: "다크",
    notePreferences: "노트 설정",
    notePreferencesDesc: "AI 생성 노트의 생성 방식을 설정합니다.",
    defaultLanguage: "기본 언어",
    defaultLanguageDesc: "생성되는 노트와 요약의 언어.",
    autoFlashcards: "플래시카드 자동 생성",
    autoFlashcardsDesc: "노트 생성 시 플래시카드를 자동으로 만듭니다.",
    autoPracticeTests: "연습 테스트 자동 생성",
    autoPracticeTestsDesc: "노트 생성 시 연습 테스트를 자동으로 만듭니다.",
    account: "계정",
    accountDesc: "계정 데이터와 환경설정을 관리합니다.",
    exportAllData: "모든 데이터 내보내기",
    deleteAccount: "계정 삭제",
  },
  photoSolver: {
    title: "사진 풀이",
    subtitle: "문제 사진을 찍거나 이미지를 업로드하여 단계별 풀이를 받으세요",
    takeOrUpload: "사진을 찍거나 이미지를 업로드하세요",
    ofAnyProblem: "수학, 과학 또는 학술 문제",
    uploadImage: "이미지 업로드",
    takePhoto: "사진 촬영",
    imageUploaded: "문제 이미지가 업로드되었습니다",
    analyzing: "문제를 분석하는 중...",
    analyzingSubtext: "AI를 사용하여 문제를 식별하고 풀이하는 중",
    problem: "문제",
    stepByStep: "단계별 풀이",
    askFollowUp: "추가 질문하기",
    followUpPlaceholder: "예: 2단계를 더 자세히 설명해 줄 수 있나요?",
    thinking: "생각하는 중...",
  },
  audioRecorder: {
    title: "오디오 녹음기",
    subtitle: "오디오를 녹음하고 녹음에서 AI 노트를 생성합니다.",
    recordingSaved: "녹음이 저장되었습니다!",
    audioSaved: "오디오 녹음이 성공적으로 저장되었습니다.",
    generateNotes: "노트 생성",
    downloadRecording: "녹음 다운로드",
    newRecording: "새 녹음",
    microphoneReady: "마이크 준비됨",
  },
  screenRecorder: {
    title: "화면 녹화",
    subtitle: "화면을 녹화하고 녹화에서 AI 노트를 생성합니다.",
    audioWarning: "잊지 말고",
    shareAudio: "오디오 공유",
    recordingSaved: "녹화가 저장되었습니다!",
    screenSaved: "화면 녹화가 성공적으로 저장되었습니다.",
    generateNotes: "노트 생성",
    downloadRecording: "녹화 다운로드",
    newRecording: "새 녹화",
    screenPreview: "여기에 화면이 표시됩니다",
    recordingPaused: "녹화 일시 중지됨",
    microphone: "마이크",
    quality: "화질",
    systemAudioNote: "기본적으로 시스템/탭 오디오 캡처가 요청됩니다. 위의 마이크를 켜서 음성도 함께 녹음할 수 있습니다.",
  },
  common: {
    delete: "삭제",
    cancel: "취소",
    save: "저장",
    back: "뒤로",
    confirmDelete: "이 작업은 되돌릴 수 없습니다.",
  },
};

export const translations: Record<Language, Translations> = {
  english: en,
  spanish: es,
  french: fr,
  german: de,
  chinese: zh,
  japanese: ja,
  korean: ko,
};
