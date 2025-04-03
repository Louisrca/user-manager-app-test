import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10, // Nombre d'utilisateurs virtuels
  duration: "30s", // Durée du test
};

const API_URL = "http://0.0.0.0:8000/src/api.php";

const firstNames = [
  "Sylvain",
  "Eliott",
  "Clarisse",
  "Amandine",
  "Kenji",
  "Fatima",
  "Luca",
  "Aisha",
  "Hiroshi",
  "Mei",
  "Omar",
  "Sofia",
  "Leonardo",
  "Maria",
  "Hans",
  "Elena",
  "Dmitri",
  "Anastasia",
  "Carlos",
  "Isabella",
  "John",
  "Emily",
  "Ahmed",
  "Zahra",
];

const lastNames = [
  "Dupont",
  "McWalter",
  "Takahashi",
  "Gonzalez",
  "Schmidt",
  "Ivanov",
  "Al-Farsi",
  "Silva",
  "Yamamoto",
  "Nguyen",
  "Kowalski",
  "Müller",
  "Hernandez",
  "Petrov",
  "Chang",
  "Smith",
  "Brown",
  "Ferrer",
  "Lemoine",
  "Okafor",
  "Lopez",
  "Hassan",
];

export default function () {
  // Générer un prénom et un nom de famille aléatoires
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  // Utiliser le même nom pour l'email et le nom complet
  const email = `${firstName}.${Math.floor(
    Math.random() * 1000000
  )}@example.com`;

  let formData = {
    name: `${firstName} ${lastName}`, // Nom complet
    email: email, // Email cohérent avec le prénom
  };

  let params = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  let res = http.post(API_URL, formData, params);

  // Afficher le statut et la réponse pour le débogage
  console.log(`Status: ${res.status}, Response: ${res.body}`);

  check(res, { "Statut 200": (r) => r.status === 200 });

  // Récupérer les utilisateurs
  res = http.get(API_URL);
  check(res, { "Liste non vide": (r) => r.json().length > 0 });

  // Pause avant la prochaine itération
  sleep(1);
}
