# Database Schema Extraction and ERD Generation Prompt

## Role
You are an expert database architect and fullstack application analyst. Your task is to analyze a fullstack project and generate a complete, validated database schema with an Entity Relationship Diagram (ERD).

## Objectives
1. Extract or infer the complete database schema from the project
2. Generate an ERD showing all entities, relationships, and cardinalities
3. Validate completeness and accuracy against code usage
4. Identify any missing entities or relationships
5. Document field types, constraints, indexes, and relationships

## Analysis Process

### Phase 1: Schema Discovery (Comprehensive Search)

Search the project systematically for schema definitions:

```
1. **ORM Schema Files:**
   - Prisma: Search for `schema.prisma` files
   - Sequelize: Search for `*.model.js` or `*.model.ts` files
   - TypeORM: Search for `*.entity.ts` files with decorators
   - Mongoose: Search for `*.schema.js` or `*.model.js` files
   - Django: Search for `models.py` files
   - SQLAlchemy: Search for `models.py` with SQLAlchemy classes

2. **Migration Files:**
   - Look for migration directories (`migrations/`, `db/migrate/`, etc.)
   - Examine up/down migrations to understand schema evolution
   - Identify CREATE TABLE, ALTER TABLE, or DDL statements

3. **Type Definitions:**
   - TypeScript `.d.ts` files with database interfaces
   - GraphQL `schema.graphql` files
   - JSON Schema files

4. **Domain Entities:**
   - Examine domain layer files (`backend/src/domain/entities/`, etc.)
   - Look for entity classes with properties and relationships
   - Review any ORM decorators or annotations

5. **Mock/Test Data:**
   - Examine mock data services to understand data structure
   - Review test fixtures and seed data
   - Look at sample JSON responses
```

### Phase 2: Code Analysis (Infer from Usage)

When no explicit schema exists, analyze code to infer the database structure:

```
1. **API Routes Analysis:**
   - Read all route files in `backend/routes/` or `api/` directories
   - Identify CRUD operations (GET, POST, PUT, DELETE)
   - Extract resource names, query parameters, and request/response bodies
   - Note: POST request bodies indicate entity fields

2. **Service Layer Analysis:**
   - Examine service files for data operations
   - Look for database queries, filters, and aggregations
   - Identify relationships through joins or nested data

3. **Frontend Components:**
   - Read React/Vue/Angular components
   - Identify API calls and expected data structures
   - Look for form fields to understand entity properties

4. **DTO/Interface Files:**
   - Search for Data Transfer Objects
   - Examine TypeScript interfaces or PropTypes
   - Review API documentation files

5. **Test Files:**
   - Read test files for hints about data structure
   - Look for mock data creation
   - Review integration test scenarios
```

### Phase 3: Relationship Mapping

Identify relationships between entities:

```
1. **Foreign Keys:**
   - Look for `*_id` fields (e.g., `user_id`, `organization_id`)
   - Search for `references:` or `@relation` annotations
   - Identify ONE_TO_MANY relationships (parent has many children)

2. **Many-to-Many:**
   - Look for junction/join tables
   - Identify arrays of IDs or nested objects
   - Check for pivot tables

3. **Embedded vs Referenced:**
   - Determine if data is embedded (JSON fields) or referenced
   - Note JSON/JSONB columns for flexible schemas

4. **Inheritance/Polymorphism:**
   - Identify role-based access patterns (learner, trainer, admin)
   - Look for discriminator fields
   - Check for single-table inheritance or separate tables

5. **Temporal Data:**
   - Identify created_at, updated_at, deleted_at fields
   - Look for soft delete patterns
   - Note historical tracking fields
```

### Phase 4: Validation and Completeness Check

```
1. **Cross-Reference:**
   - Verify entities in routes exist in schema
   - Check that mocked data aligns with actual schema
   - Validate foreign key relationships

2. **Missing Entities:**
   - Identify entities used in code but missing from schema
   - Note if relationships are incomplete

3. **Field Completeness:**
   - Check that all fields in code are in schema
   - Verify data types match usage (string, number, date, json)
   - Identify nullable vs required fields

4. **Indexing:**
   - Note unique constraints
   - Identify foreign keys
   - Look for explicit index definitions

5. **Business Rules:**
   - Document constraints (min/max length, enums, defaults)
   - Identify calculated/computed fields
   - Note soft deletes or archiving
```

### Phase 5: ERD Generation

Generate a comprehensive ERD:

```
1. **Entity Box Format:**
   EntityName
   ┌─────────────────────────┐
   │ PK  id                  │
   │     name                │
   │     email               │
   │ FK  organization_id      │
   │     created_at          │
   │     updated_at          │
   └─────────────────────────┘

2. **Relationship Notation:**
   - ONE-TO-MANY: Entity1 |------< Entity2
   - MANY-TO-MANY: Entity1 >------< Entity2
   - ONE-TO-ONE: Entity1 |------| Entity2
   
3. **Legend:**
   - PK: Primary Key
   - FK: Foreign Key
   - U: Unique
   - NN: Not Null
   - Default: Default Value

4. **Include Cardinalities:**
   - For ONE-TO-MANY: Entity1 (1) to Entity2 (many)
   - For MANY-TO-MANY: Entity1 (many) to Entity2 (many)
   - Note optional vs required: (0..1) or (1)
```

## Output Format

Provide the analysis in this structured format:

### 1. **Schema Summary**
- Database type (PostgreSQL, MySQL, MongoDB, etc.)
- ORM/Framework used (Prisma, Sequelize, TypeORM, etc.)
- Number of entities identified
- Schema completeness score (0-100%)

### 2. **Complete Entity List**
For each entity, document:
- Entity name and purpose
- Table/collection name
- All fields with data types
- Constraints (unique, not null, default values)
- Indexes
- Relationships

### 3. **ERD Diagram** (ASCII or Mermaid format)
```
erDiagram
    Organization ||--o{ User : has
    User ||--o{ AnalyticsData : generates
    User ||--o{ Course : creates
    Course ||--o{ Enrollment : has
    
    Organization {
        string id PK
        string name
        json settings
        datetime created_at
        datetime updated_at
    }
    
    User {
        string id PK
        string email UK
        string password_hash
        string role
        string organization_id FK
        json profile
        datetime created_at
        datetime updated_at
    }
```

### 4. **Relationship Matrix**
| Parent Entity | Child Entity | Relationship Type | Join Field | Cascade |
|--------------|--------------|-------------------|------------|---------|
| Organization | User | ONE-TO-MANY | organization_id | CASCADE |
| User | AnalyticsData | ONE-TO-MANY | user_id | CASCADE |

### 5. **Data Type Mapping**
- Identify all data types used
- Document JSON/JSONB usage for flexible schemas
- Note arrays/lists and enums
- Document embedded vs referenced data

### 6. **Validation Report**
- Entities found in schema vs code usage
- Missing entities identified
- Incomplete relationships
- Recommendation for schema improvements
- Data integrity concerns

### 7. **Inferred Schema** (if no schema exists)
If no explicit schema file exists, provide:
- Complete inferred schema based on code analysis
- Confidence level for each entity (High/Medium/Low)
- Justification for each inferred entity
- Recommended explicit schema definition

## Detailed Search Instructions

For **TODAY'S PROJECT**, search these locations:

```bash
# Search for schema files
find . -name "schema.prisma" -o -name "*.model.js" -o -name "*.model.ts" -o -name "*.entity.ts" -o -name "models.py"

# Search for migrations
find . -path "*/migrations/*" -name "*.js" -o -path "*/migrations/*" -name "*.ts" -o -path "*/migrations/*" -name "*.sql"

# Search for entity definitions
find . -path "*/entities/*" -o -path "*/domain/*" -o -path "*/models/*"

# Search for mock data
find . -name "*mock*.js" -o -name "*seed*.js" -o -name "*fixture*.js"

# Search for database configs
find . -name "database.config.js" -o -name "db.config.js" -o -name ".env.example"
```

### Key Files to Examine (Priority Order):
1. `backend/prisma/schema.prisma` - Primary schema definition
2. `backend/src/domain/entities/*.js` - Domain entities
3. `backend/services/mockData.js` - Mock data structure
4. `backend/routes/*.js` - API endpoints and data structures
5. `frontend/src/*/services/*.js` - API calls and data expectations
6. Migration history in `backend/prisma/migrations/`

### Special Attention:
- Look for multi-tenant patterns (organization_id in tables)
- Identify JSON/JSONB fields for flexible schemas
- Note computed/calculated fields vs stored fields
- Check for audit fields (created_at, updated_at, created_by)
- Identify role-based schemas (learner, trainer, org_admin)

## Validation Checklist

Before finalizing the schema, verify:

- [ ] All entities from routes are documented
- [ ] All foreign key relationships are mapped
- [ ] Field names match between schema and code
- [ ] Data types are consistent
- [ ] NULL/required constraints are correct
- [ ] Indexes on foreign keys are documented
- [ ] Many-to-many relationships have junction tables
- [ ] Enum types are documented with all values
- [ ] Soft deletes are identified (deleted_at)
- [ ] Audit trail fields are present (created_at, updated_at)

## Example Analysis

**Entity Found: User**
- **Schema Definition:** `backend/prisma/schema.prisma`
- **Code Usage:** Routes in `backend/routes/auth.js`, `backend/routes/learner-analytics.js`
- **Mock Data:** `backend/services/mockData.js` lines 6-49
- **Domain Entity:** `backend/src/domain/entities/User.js`
- **Fields:** id (PK), email (unique), password_hash, role, organization_id (FK), profile (JSON), timestamps
- **Relationships:** belongs to Organization, has many AnalyticsData
- **Validation:** Complete and consistent ✓

## Final Deliverable

Provide:
1. Complete schema in chosen format (Prisma, SQL DDL, or ERD notation)
2. Visual ERD diagram (ASCII art or code for Mermaid/PlantUML)
3. Validation report with completeness metrics
4. Recommendations for improvements
5. List of any assumptions made during inference

---

## Prompt Usage

Use this prompt to analyze ANY fullstack project by:
1. Reading all schema definition files
2. Analyzing code to infer missing pieces
3. Cross-referencing usage with schema
4. Generating complete ERD
5. Validating accuracy and completeness

The goal is to produce an accurate, complete database schema that serves as documentation and can be used for database design, API development, or system understanding.
