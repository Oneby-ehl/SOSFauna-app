import { Link, Stack } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SeoHead } from "@/components/seo/SeoHead";

const storageUses = [
  "recuperar un aviso no finalizado;",
  "mantener un historial reciente de avisos;",
  "recordar determinados datos facilitados por el usuario;",
  "conservar temporalmente la información necesaria para preparar un aviso.",
];

export default function PrivacyPage() {
  return (
    <>
      <SeoHead
        title="Política de privacidad | SOS Fauna España"
        description="Consulta cómo SOS Fauna España gestiona los permisos, el almacenamiento local y la información utilizada en la aplicación web y Android."
        path="/privacy"
      />
      <Stack.Screen
        options={{ title: "Política de privacidad | SOS Fauna España" }}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SOS FAUNA ESPAÑA</Text>
          <Text style={styles.title}>Política de privacidad</Text>
          <Text style={styles.updated}>
            Última actualización: julio de 2026
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.heading}>1. Información general</Text>

          <Text style={styles.paragraph}>
            SOS Fauna España es un proyecto independiente creado para ofrecer
            orientación ante incidencias con fauna silvestre.
          </Text>

          <Text style={styles.paragraph}>
            Esta política de privacidad es aplicable a la versión web, a la
            aplicación web instalada como PWA y a la aplicación para Android.
          </Text>

          <Text style={styles.heading}>2. Datos personales</Text>

          <Text style={styles.paragraph}>
            SOS Fauna España no recopila ni transmite datos personales a
            servidores propios.
          </Text>

          <Text style={styles.paragraph}>
            La información que el usuario introduce, como el nombre, el teléfono,
            la ubicación, las fotografías o los vídeos, puede almacenarse
            localmente en su propio dispositivo cuando resulta necesario para
            preparar un aviso, recuperar un aviso no finalizado, mantener un
            historial reciente o recordar determinados datos introducidos
            previamente.
          </Text>

          <Text style={styles.paragraph}>
            Esta información permanece bajo el control del usuario y no se envía
            automáticamente a ningún servidor de SOS Fauna España.
          </Text>

          <Text style={styles.heading}>3. Permisos utilizados</Text>

          <Text style={styles.paragraph}>
            La aplicación puede solicitar acceso a la cámara, la ubicación y la
            galería o almacenamiento del dispositivo para preparar la información
            de un aviso.
          </Text>

          <Text style={styles.paragraph}>
            En dispositivos Android, estos permisos se utilizan únicamente cuando
            el usuario realiza una acción que los requiere, como obtener su
            ubicación, tomar una fotografía, grabar o seleccionar un archivo
            multimedia.
          </Text>

          <Text style={styles.paragraph}>
            El usuario puede aceptar o denegar estos permisos desde la
            configuración del navegador o del dispositivo.
          </Text>

          <Text style={styles.heading}>4. Almacenamiento local</Text>

          <Text style={styles.paragraph}>
            SOS Fauna España utiliza el almacenamiento local del navegador o del
            dispositivo para mejorar la experiencia de uso.
          </Text>

          <Text style={styles.paragraph}>
            Este almacenamiento puede utilizarse para:
          </Text>

          <View style={styles.list}>
            {storageUses.map((item) => (
              <View key={item} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.paragraph}>
            Esta información permanece exclusivamente en el dispositivo del
            usuario y no se sincroniza con servidores propios de SOS Fauna
            España.
          </Text>

          <Text style={styles.heading}>
            5. Compartición voluntaria de información
          </Text>

          <Text style={styles.paragraph}>
            SOS Fauna España no envía automáticamente la información preparada
            por el usuario.
          </Text>

          <Text style={styles.paragraph}>
            Cuando el usuario decide compartir un aviso mediante aplicaciones de
            mensajería, correo electrónico, llamadas, mapas u otros servicios
            externos, la información seleccionada se transmite al servicio
            elegido por el propio usuario.
          </Text>

          <Text style={styles.paragraph}>
            A partir de ese momento pueden aplicarse las condiciones y políticas
            de privacidad del servicio externo utilizado.
          </Text>

          <Text style={styles.heading}>6. Servicios externos</Text>

          <Text style={styles.paragraph}>
            Al abrir enlaces, mapas, aplicaciones de mensajería o realizar
            llamadas o utilizar otros servicios externos, pueden aplicarse sus
            propias políticas de privacidad y condiciones de uso.
          </Text>

          <Text style={styles.paragraph}>
            SOS Fauna España no controla el tratamiento de datos realizado por
            esos servicios externos.
          </Text>

          <Text style={styles.heading}>7. Eliminación de la información</Text>

          <Text style={styles.paragraph}>
            Toda la información almacenada localmente puede eliminarse en
            cualquier momento.
          </Text>

          <Text style={styles.paragraph}>
            En la versión web o PWA, puede eliminarse borrando los datos del
            sitio desde la configuración del navegador o desinstalando la PWA.
          </Text>

          <Text style={styles.paragraph}>
            En Android, puede eliminarse borrando los datos de la aplicación
            desde los ajustes del dispositivo o desinstalando la aplicación.
          </Text>

          <Text style={styles.paragraph}>
            La aplicación también puede ofrecer funciones propias para finalizar
            o eliminar avisos guardados, cuando estén disponibles.
          </Text>

          <Text style={styles.heading}>8. Proyecto independiente</Text>

          <Text style={styles.paragraph}>
            SOS Fauna España no está afiliada ni representa a ninguna
            administración pública, servicio de emergencias, cuerpo policial o
            centro de recuperación de fauna.
          </Text>

          <Text style={styles.heading}>9. Contacto</Text>

          <Text style={styles.paragraph}>
            Para consultas relacionadas con esta política de privacidad, puede
            utilizarse el correo electrónico de contacto indicado en el sitio web
            y en la aplicación.
          </Text>
        </View>

        <Link href="/" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>Volver al inicio</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f7f4",
  },
  container: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 64,
    gap: 28,
  },
  header: {
    gap: 12,
  },
  eyebrow: {
    color: "#166534",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  content: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 32,
  },
  title: {
    color: "#14532d",
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "900",
  },
  updated: {
    maxWidth: 760,
    color: "#4b5563",
    fontSize: 17,
    lineHeight: 27,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 12,
  },
  list: {
    gap: 8,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 25,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 25,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#14532d",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
});
