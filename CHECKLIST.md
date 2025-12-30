# Post-Change Checklist

Before committing any changes, verify adherence to the Three-Step Scalability Doctrine.

---

## 1. Isolate by Feature

### Feature Isolation
- [ ] **Is this change in a self-contained feature module?**
  - Feature code lives in `src/features/[feature-name]/`
  - Feature owns its UI, logic, tests, and API

- [ ] **Does this feature depend on other features?**
  - ❌ Features should NOT import from other features
  - ✅ Features can import from `src/foundations/`
  - ✅ Features can import from `src/main.ts` (coordination only)

- [ ] **Can this feature be deleted without touching other code?**
  - All feature code is in one directory
  - No other features import from this feature
  - No shared state or coupling with other features

- [ ] **Is the feature understandable in isolation?**
  - Feature logic is self-contained
  - Dependencies are clear and minimal
  - No hidden dependencies on other features

---

## 2. Extract Foundations Early

### Foundation Extraction
- [ ] **Is code duplicated across multiple features?**
  - If YES: Extract to `src/foundations/`
  - If NO: Keep it in the feature

- [ ] **Was this foundation created deliberately?**
  - Foundation extracted only after 2+ features need it
  - Not extracted "just in case" or prematurely

- [ ] **Is the foundation minimal?**
  - Contains only what multiple features actually use
  - No over-engineering or premature abstraction

- [ ] **Does the foundation know about features?**
  - ❌ Foundation should NOT import from `src/features/`
  - ✅ Foundation can import from other foundations
  - ✅ Foundation can import from `src/main.ts` (coordination only)

- [ ] **Would two future features disagree about this code?**
  - If YES: It's feature-specific, keep it in the feature
  - If NO: It's a good candidate for a foundation

---

## 3. Expose Only Small Public Interfaces

### Public API Design
- [ ] **Does this module have one public entry point?**
  - Single `index.ts` or `[module-name].ts` file exports the public API
  - Internal files are not directly imported by consumers

- [ ] **Are internals private by default?**
  - Internal functions/classes are not exported
  - Only the public API is exported
  - Use TypeScript's `export` keyword only for public interfaces

- [ ] **Is the public interface narrow and explicit?**
  - Exports only what consumers need
  - No "just in case" exports
  - Clear, minimal API surface

- [ ] **Do dependencies flow in one direction?**
  - Features → Foundations (✅ allowed)
  - Features → Features (❌ not allowed)
  - Foundations → Features (❌ not allowed)
  - Foundations → Foundations (✅ allowed, but be careful)

- [ ] **Could I change the internals without changing consumers?**
  - Internal implementation is hidden
  - Public API is stable
  - Changes to internals don't break consumers

---

## 4. Code Quality Checks

### Build & Type Safety
- [ ] **Does the project build successfully?**
  ```bash
  npm run build
  ```

- [ ] **Are there TypeScript errors?**
  - All types are properly defined
  - No `any` types (unless absolutely necessary)
  - Strict type checking passes

- [ ] **Is the code organized correctly?**
  - Feature code in `src/features/`
  - Foundation code in `src/foundations/`
  - Coordination code in `src/main.ts`

---

## 5. Final Verification

### Litmus Tests
Before committing, ask yourself:

1. **"Can I delete this feature without touching the rest of the system?"**
   - If NO: Refactor to improve isolation

2. **"Would two future features disagree about this code?"**
   - If YES: Keep it in the feature, don't extract to foundation

3. **"Could I change the internals without changing consumers?"**
   - If NO: Reduce the public API surface

---

## 6. Self-Review Scoring

After completing the checklist above, rate your adherence to each principle and provide an overall assessment.

### Scoring Scale
- **5 (Excellent)**: Fully adheres to the principle, no violations
- **4 (Good)**: Mostly adheres, minor issues that don't affect scalability
- **3 (Acceptable)**: Generally follows the principle, but some concerns exist
- **2 (Needs Improvement)**: Significant violations that could impact scalability
- **1 (Poor)**: Major violations, does not follow the principle

### Principle 1: Isolate by Feature
**Score: ___ / 5**

**Notes:**
- Feature isolation: _________________________________________________
- Cross-feature dependencies: ________________________________________
- Deletability: _____________________________________________________
- Local reasoning: _________________________________________________

**Improvements needed:**
- _______________________________________________________________
- _______________________________________________________________

---

### Principle 2: Extract Foundations Early
**Score: ___ / 5**

**Notes:**
- Duplication handling: ____________________________________________
- Foundation extraction timing: _____________________________________
- Foundation minimalism: __________________________________________
- Foundation isolation: ____________________________________________

**Improvements needed:**
- _______________________________________________________________
- _______________________________________________________________

---

### Principle 3: Expose Only Small Public Interfaces
**Score: ___ / 5**

**Notes:**
- Single entry point: _______________________________________________
- Private internals: _______________________________________________
- API narrowness: _________________________________________________
- Dependency direction: ___________________________________________

**Improvements needed:**
- _______________________________________________________________
- _______________________________________________________________

---

### Overall Assessment

**Total Score: ___ / 15**

**Overall Rating:**
- [ ] Excellent (13-15): Changes fully adhere to all principles
- [ ] Good (10-12): Changes mostly adhere, minor improvements possible
- [ ] Acceptable (7-9): Changes generally follow principles, some refactoring needed
- [ ] Needs Improvement (4-6): Significant refactoring required before committing
- [ ] Poor (1-3): Major refactoring required, do not commit

**Summary:**
_______________________________________________________________________
_______________________________________________________________________
_______________________________________________________________________

**Action Items Before Next Commit:**
- [ ] _________________________________________________________________
- [ ] _________________________________________________________________
- [ ] _________________________________________________________________

**Date:** ___________  
**Change Description:** _______________________________________________

---

## Quick Reference

### Directory Structure
```
src/
  ├── features/      # Self-contained feature modules
  │   └── [feature]/
  │       ├── index.ts    # Public API (single entry point)
  │       ├── ui.ts       # Feature UI
  │       ├── logic.ts    # Feature logic
  │       └── tests.ts    # Feature tests
  │
  ├── foundations/   # Shared code (extracted when needed)
  │   └── [foundation]/
  │       └── index.ts    # Public API (single entry point)
  │
  └── main.ts        # Application entry point (coordinates features)
```

### Import Rules
- ✅ `features/[a]` → `foundations/[x]`
- ✅ `features/[a]` → `main.ts`
- ✅ `foundations/[a]` → `foundations/[b]`
- ❌ `features/[a]` → `features/[b]`
- ❌ `foundations/[a]` → `features/[x]`

---

**Remember**: These practices are not optional. Following them strictly ensures scalability becomes the default outcome.

