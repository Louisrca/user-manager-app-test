import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
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
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  const email = `${firstName}.${Math.floor(
    Math.random() * 1000000
  )}@example.com`;

  let formData = {
    name: `${firstName} ${lastName}`,
    email: email,
  };

  let params = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  let res = http.post(API_URL, formData, params);

  console.log(`Status: ${res.status}, Response: ${res.body}`);

  check(res, { "Statut 200": (r) => r.status === 200 });

  res = http.get(API_URL);
  check(res, { "Liste non vide": (r) => r.json().length > 0 });

  sleep(1);
}
