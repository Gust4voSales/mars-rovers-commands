# Mars Rovers Commands

## Todo List

- [x] **1. Domain entity for rover with basic movement actions**
- [x] **2. Domain entity for the plateau with bounding box verification**
  - [x] Check initial positions inside plateau
  - [x] Bounding box
  - [x] Other rovers (extra)
- [x] **3. Service parser that reads a string and parses it into commands and returns a plateau with rovers**
- [x] **4. Infrastructure layer that reads a file and maps to rovers**
- [ ] **5. Docker Build**
- [ ] **6. Documentation**

## Getting Started

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev ./input/example.txt

# Build project
npm run build

# Run compiled version
npm start ./input/example.txt
```
