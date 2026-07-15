import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PrivacyPage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          SOS Fauna España — Política de privacidad
        </Text>

        <Text style={styles.updated}>
          Última actualización: junio de 2026
        </Text>

        <Text style={styles.heading}>1. Información general</Text>

        <Text style={styles.paragraph}>
          SOS Fauna España es un proyecto independiente creado para ofrecer
          orientación ante incidencias con fauna silvestre.
        </Text>

        <Text style={styles.heading}>2. Datos personales</Text>

        <Text style={styles.paragraph}>
          El sitio web y la aplicación no recopilan, almacenan ni transmiten
          datos personales a servidores propios.
        </Text>

        <Text style={styles.heading}>3. Permisos utilizados</Text>

        <Text style={styles.paragraph}>
          La aplicación puede solicitar acceso a la cámara, la ubicación y la
          galería o almacenamiento del dispositivo para preparar la información
          de un aviso.
        </Text>

        <Text style={styles.paragraph}>
          La información permanece en el dispositivo salvo que el usuario
          decida compartirla voluntariamente mediante aplicaciones o servicios
          externos.
        </Text>

        <Text style={styles.heading}>4. Servicios externos</Text>

        <Text style={styles.paragraph}>
          Al abrir enlaces, mapas, aplicaciones de mensajería o realizar
          llamadas, pueden aplicarse las políticas de privacidad de esos
          servicios externos.
        </Text>

        <Text style={styles.heading}>5. Proyecto independiente</Text>

        <Text style={styles.paragraph}>
          SOS Fauna España no está afiliada ni representa a ninguna
          administración pública, servicio de emergencias, cuerpo policial o
          centro de recuperación de fauna.
        </Text>

        <Text style={styles.heading}>6. Contacto</Text>

        <Text style={styles.paragraph}>
          Para consultas relacionadas con esta política de privacidad, puede
          utilizarse el correo electrónico de contacto indicado en el sitio web
          y en la aplicación.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f7f2",
    paddingHorizontal: 24,
    paddingVertical: 48,
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
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  updated: {
    fontSize: 14,
    marginBottom: 32,
    opacity: 0.7,
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
});