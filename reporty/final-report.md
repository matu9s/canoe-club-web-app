# Final report
- **Meno:** Matúš Hluch
- **Názov projektu:** Webová aplikácia pre kanoistický klub
- **Link na repozitár:**
  - https://github.com/matu9s/canoe-club-web-app
  - **Tag:** final
- **Link na verejnú inštanciu projektu:**
  - https://matu9s.pythonanywhere.com
- **Postup ako rozbehať vývojové prostredie:**
  - (Spúšťané na Linuxe)
  - **Potrebný software:**
    - Python 3.10.6
    - npm 9.5.0
    - Docker 23.0.3
  - **1. Vytvorenie .env súboru:**
    - V počiatočnom priečinku vytvorte .env súbor s obsahom:
    ```
    MYSQL_ROOT_PASSWORD={reťazec root heslo do databázy}
    DB_USER="matus"
    DB_PASSWORD={reťazec heslo do databázy}
    DB_DATABASE="canoe"
    DB_HOST_ADDRESS="localhost"
    SECRET_KEY={reťazec secret key pre flask}
    ```
  - **2. Inštalácia backendu:**
    ```console
    python -m venv venv
    source ./venv/bin/activate
    pip install -r requirements.txt
    ```
  - **3. Spustenie databázy:**
     ```console
     docker compose up
     ```
  - **4. Inicializácia databázy**
    - V priečinku `/src/`
    ```console
    flask --app=flask_app.py db upgrade
    ```
  - **4.\* Inicializácia databázy (spustiť iba raz pri prvom spúšťaní)**
    - V priečinku `/src/`
    ```console
    python init_db.py
    ```
  - **5. Spustenie backendu:**
    - V priečinku `/src/`
    ```console
    python flask_app.py
    ```
  - **6. Inštalácia frontendu:**
    - V priečinku `/react-frontend/`
    ```console
    npm install  
    ```
  - **7. Spustenie frontendu:**
    - V priečinku `/react-frontend/`
    ```console
    npm start
    ``` 
**Aktuálny stav:**
- **Už implementované:**
  - Prepojenie datbázy, backendu a frontedu
  - Pripravené tabuľky a vzťahy v databáze
  - Login a registrácia so 4 rolami (admin, tréner, člen, správca)
    - Backend aj formuláre/tlačidlá pre frontend
  - Perzistencia loginu
  - Routing na frontende
  - Navbar na frontende
  - Frontend a backend pre pridávanie nových lodí, požičiavanie lodí a editáciu chýb
  - Frontend a backend pre informácie o členoch a správu členského poplatku
  - Frontend a backend pre pridávanie a prihlasovanie sa na tréningy
- **Rozpracované:**
  - N/A
- **Neimplementované:**
  - Administrátor by mohol mať možnosť upraviť ešte viac dát.
- **Problémy:**
  - Stihnúť všetko dokončiť.
- **Keby ste to robili znovu, čo by ste urobili inak?**
  - Lepšie by som premyslel niektoré veci na začiatku projektu. Využil by som react knižnicu formik na tvorbu formulárov. Namiesto cookie-based autentifikácie by som využil token based autentifikáciu.
- **Ste hrdý na výsledky svojej práce? Ktorý aspekt projektu je podľa Vás najviac kvalitný?:**
  - Som hrdý na to, že sa mi podarilo implementovať takmer celú navrhnutú funkcionalitu, ktorej bolo pomerne veľa. Najviac kvalitný aspekt tohoto projektu je podľa mňa to, že väčšina funkcionality funguje pomerne spoľahlivo a je použiteľná v praxi.
