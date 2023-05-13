# Ecojourney

[![version](https://img.shields.io/github/package-json/v/GaelGirodon/ecojourney?style=flat-square)](https://github.com/GaelGirodon/ecojourney/releases/latest)
[![license](https://img.shields.io/github/license/GaelGirodon/ecojourney?color=blue&style=flat-square)](./LICENSE)
[![build](https://img.shields.io/github/actions/workflow/status/GaelGirodon/ecojourney/main.yml?branch=main&style=flat-square)](https://github.com/GaelGirodon/ecojourney/actions/workflows/main.yml)
[![tests](https://img.shields.io/endpoint?style=flat-square&url=https%3A%2F%2Fgist.githubusercontent.com%2FGaelGirodon%2Ffbde4d59b7dd3c4f2cc9c4fea3497ae1%2Fraw%2Fecojourney-junit-tests.json)](https://github.com/GaelGirodon/ecojourney/actions/workflows/main.yml)
[![coverage](https://img.shields.io/endpoint?style=flat-square&url=https%3A%2F%2Fgist.githubusercontent.com%2FGaelGirodon%2Ffbde4d59b7dd3c4f2cc9c4fea3497ae1%2Fraw%2Fecojourney-cobertura-coverage.json)](https://github.com/GaelGirodon/ecojourney/actions/workflows/main.yml)

**Ecojourney** is an eco-design website audit tool
focused on best practices over scoring.

> 🚧 **Ecojourney is in alpha stage**  🚧
>
> _Everything is experimental and may change significantly at any time._
>
> The NPM package hasn't been published yet, but it can be installed from the
> tarball generated by the [`build`](https://github.com/GaelGirodon/ecojourney/actions)
> job. Download and extract the `tarball.zip` file, then run:
>
> ```shell
> npm i -g ecojourney-X.Y.Z.tgz
> ```

## About

_Ecojourney_ analyses a browsing scenario on a web application, collecting
metrics and issues about eco-design best practices.

It is made to help developers improve their web application by highlighting
issues to fix in order to reduce its environmental impact, primarily on
end-user devices and network infrastructures. But this is not enough to affirm
that a web application is environmental friendly: an _Ecojourney_ audit should
be completed by automated and manual source code analysis, server-side
application analysis (e.g. energy consumption metrology with Scaphandre), and
should come after a rigorous UX design process (to focus on simple and useful
features), Life-Cycle Assessments (ISO 14040 & 14044), and more.

Under the hood, this tool is built to be modular, extensible (_coming soon!_),
and it uses a carefully selected small set of NPM dependencies (8, including
transitive ones). Playwright is the main one, enabling cross-browser web
automation, device emulation, proxy support and more.

_Ecojourney_ is inspired by these tools, sharing several similarities, but
trying to bring different features and/or various improvements:

- [_Lighthouse_](https://github.com/GoogleChrome/lighthouse),
  but focuses on eco-design (even if there's some overlap with performance) and
  allows to analyse multiple pages and complex scenarios with a single run,
- [_GreenIT Analysis_](https://github.com/cnumr/GreenIT-Analysis)
  ([_CLI_](https://github.com/cnumr/GreenIT-Analysis-cli)),
  but focuses on best practices over scoring and with a more refined API
  and tooling,
- [_EcoIndex_](https://github.com/cnumr/Ecoindex),
  but focuses on best practices over scoring, with more metrics and
  bundled as a CLI tool instead of a web service.

## Quick start

💻 **Make sure your computer meets the following requirements:**

- **Node.js 18.x or newer**
- **A web browser**: Google Chrome, Microsoft Edge
  or a [Playwright supported browser](https://playwright.dev/docs/browsers)

📦 **Install using `npm`:**

```shell
npm i -g ecojourney
```

🌐 **Audit a single URL:**

```shell
ecojourney audit https://mywebsite.net
```

📄 **Initialise a manifest file and run it:**

```shell
ecojourney init mywebsite.yml
ecojourney audit mywebsite.yml
```

## Installation

**Ecojourney** is published as an NPM package and can be installed in various
ways as long as Node.js and your favorite package manager are installed on your
workstation.

Install and run globally:

```shell
npm i ecojourney -g
ecojourney [command]
```

Install and run globally, using `npx`:

```shell
npx ecojourney [command]
```

Install as a dev dependency of your Node.js project (_recommended_):

```shell
cd my-project/
npm i ecojourney -D
```

- Run locally:

```shell
npx ecojourney [command]
```

- Run locally, using a dedicated script in your `package.json` file:

```json
{
  "scripts": {
    "ecojourney": "ecojourney audit ecojourney.yml"
  }
}
```

```shell
npm run ecojourney
```

## Usage

Initialise a manifest YAML file:

```shell
ecojourney init mywebsite.yml
```

Edit file content:

- Define the browsing scenario to audit
- Customise the configuration: browser, device, report formats, proxy, ...

Run the audit:

```shell
ecojourney audit mywebsite.yml
```

Some configuration options can be overridden from the CLI or environment
variables:

```shell
export ECOJOURNEY_AUDIT_BROWSER="msedge"
ecojourney audit mywebsite.yml --dry-run
```

### CLI

_Ecojourney_ commands can be executed from a terminal:

<!-- <cli> -->
```shell
ecojourney [options] [command]
```

**Global options**

| Flags           | Description               | Environment variable |
| --------------- | ------------------------- | -------------------- |
| `-V, --version` | Output the version number |                      |
| `-v, --verbose` | Enable verbose output     | `ECOJOURNEY_VERBOSE` |
| `-h, --help`    | Display help for command  |                      |

**Commands**

| Name              | Usage              | Description                              |
| ----------------- | ------------------ | ---------------------------------------- |
| [`audit`](#audit) | `[options] <path>` | Audit a website eco-design compliance    |
| [`init`](#init)   | `[options] [path]` | Initialise a manifest file interactively |

#### `audit`

Audit a website eco-design compliance.

```shell
ecojourney audit [options] <path>
```

**Arguments**

| Name   | Description                                         | Required |
| ------ | --------------------------------------------------- | :------: |
| `path` | Path to the audit manifest file or website page URL |    ☑️     |

**Options**

| Flags                       | Description                                                      | Default     | Environment variable        |
| --------------------------- | ---------------------------------------------------------------- | ----------- | --------------------------- |
| `-b, --browser [browser]`   | Browser to run the audit with                                    | `chromium`  | `ECOJOURNEY_AUDIT_BROWSER`  |
| `-l, --headless [headless]` | Run browser in headless mode                                     | `true`      | `ECOJOURNEY_AUDIT_HEADLESS` |
| `-d, --device [device]`     | Simulate browser behavior for a specific device (e.g. Galaxy S8) |             | `ECOJOURNEY_AUDIT_DEVICE`   |
| `-H, --header [headers...]` | Additional HTTP headers to be sent with every request            |             | `ECOJOURNEY_AUDIT_HEADERS`  |
| `-t, --timeout [timeout]`   | Maximum time to wait for navigations or actions, in milliseconds |             | `ECOJOURNEY_AUDIT_TIMEOUT`  |
| `-r, --retry [retry]`       | Number of retries in case of failure                             | `0`         | `ECOJOURNEY_AUDIT_RETRY`    |
| `-o, --output [output]`     | Directory to write reports to                                    | `.`         | `ECOJOURNEY_AUDIT_OUTPUT`   |
| `-f, --format [formats...]` | Output report formats                                            | `html,json` | `ECOJOURNEY_AUDIT_FORMAT`   |
| `-s, --dry-run`             | Simulate the audit without actually running the browser          | `false`     | `ECOJOURNEY_AUDIT_DRY_RUN`  |
| `-h, --help`                | Display help for command                                         |             |                             |

#### `init`

Initialise a manifest file interactively.

```shell
ecojourney init [options] [path]
```

**Arguments**

| Name   | Description                                 | Required |
| ------ | ------------------------------------------- | :------: |
| `path` | Path to the audit manifest file to generate |    🔲     |

**Options**

| Flags        | Description              | Default | Environment variable |
| ------------ | ------------------------ | ------- | -------------------- |
| `-h, --help` | Display help for command |         |                      |
<!-- </cli> -->

### Manifest

<!-- <manifest> -->
The manifest file allows to describe the audit scenario and configuration.

It can be easily and interactively initialised using the [`init`](#init)
command. A [JSON schema](./src/audit/manifest/manifest.schema.json) is also
provided to enable code completion and validation in your IDE (using built-in
JSON schema support for YAML files or via an extension).

#### Example

```yaml
# Audited website description
name: My website
description: A website that must comply with eco-design best practices
url: https://mywebsite.net

# Audit configuration (merged with CLI flags and environment variables)
config: ...

# Procedures allow to define reusable sequences of actions
procedures: ...

# Actions allow to define the browsing scenario to run and audit
actions:
  # Start a scenario (allows to group page audit results)
  - scenario: Browse blog posts
  # Navigate to the posts index page
  - goto: https://mywebsite.net/posts
  - wait: main.posts
  # Analyse the current page (including the previous navigation actions)
  - page: Posts index
  # Take a screenshot of the current page
  - screenshot: posts-index.png
  # Navigate to and audit the post page
  - click: article.post
  - wait: main.post
  - page: Post
  - screenshot: posts-single.png
```

#### Interpolation

Some properties support injecting environment variables and procedure arguments
using the double curly braces `{{` and `}}` as delimiters. This is particularly
useful to avoid committing sensitive values such as user passwords.

**Example:**

```yaml
# Fill a password input using a value set from an environment variable
- fill: { selector: "#password", value: "{{ env.PASSWORD }}" }
```

#### Metadata

```yaml
name: My website
description: A website that must comply with eco-design best practices
url: https://mywebsite.net
```

| Name          | Description                                               | Required |
| ------------- | --------------------------------------------------------- | :------: |
| `name`        | Name of the web application                               |    🔲     |
| `description` | Description of the web application or of the current test |    🔲     |
| `url`         | Main/root URL of the web application                      |    ☑️     |

#### Configuration

Audit configuration (merged with CLI flags and environment variables)

```yaml
config:
  browser: "chromium"
  headless: true
  device: "Galaxy S8"
  headers: {"X-User":"user"}
  timeout: 10000
  retries: 3
  output: "./reports/"
  formats: ["html"]
  proxy:
    server: "http://myproxy.com:3128"
    bypass: ".com, chromium.org, .domain.com"
    username: "username"
    password: "password"
  dryRun: true
  verbose: true
```

| Name         | Description                                                      | Type      | Default     | Values                                              |
| ------------ | ---------------------------------------------------------------- | --------- | ----------- | --------------------------------------------------- |
| `browser`    | Browser to run the audit with                                    | `string`  | `chromium`  | `msedge`, `chrome`, `chromium`, `firefox`, `webkit` |
| `headless`   | Run browser in headless mode                                     | `boolean` | `true`      |                                                     |
| `device`     | Simulate browser behavior for a specific device                  | `string`  |             |                                                     |
| `headers`    | Additional HTTP headers to be sent with every request            | `object`  |             |                                                     |
| `timeout`    | Maximum time to wait for navigations or actions, in milliseconds | `integer` |             |                                                     |
| `retries`    | Number of retries in case of failure                             | `integer` | `0`         |                                                     |
| `output`     | Directory to write reports to                                    | `string`  | `.`         |                                                     |
| `formats`    | Output report formats                                            | `array`   | `html,json` | `html`, `json`                                      |
| `proxy`      | Network proxy settings                                           | `object`  |             |                                                     |
| ∟ `server`   | Proxy to be used for all requests                                | `string`  |             |
| ∟ `bypass`   | Comma-separated domains to bypass proxy                          | `string`  |             |
| ∟ `username` | Username to use if HTTP proxy requires authentication            | `string`  |             |
| ∟ `password` | Password to use if HTTP proxy requires authentication            | `string`  |             |
| `dryRun`     | Simulate the audit without actually running the browser          | `boolean` | `false`     |                                                     |
| `verbose`    | Enable verbose output                                            | `boolean` | `false`     |                                                     |

#### Actions

Actions allow to define the browsing scenario to run and audit.

```yaml
actions:
  # Abbreviated syntax
  - <name>: <value1>, <value2>
  # Explicit syntax
  - <name>:
      <property1>: <value1>
      <property2>: <value2>
```

##### `check`

Check or uncheck a checkbox or a radio button.

**Abbreviated syntax**

_Argument:_ the selector to use when resolving the DOM element and the state to set (`check` or `uncheck`, default to `check`)

```yaml
- check: "input[name='remember'], check"
```

**Explicit syntax**

```yaml
- check:
    selector: "input[name='remember']"
    state: "check"
```

| Property   | Type     | Description                                                 | Required |
| ---------- | -------- | ----------------------------------------------------------- | :------: |
| `selector` | `string` | The selector to use when resolving the DOM element          |    ☑️     |
| `state`    | `string` | The state to set (`check` or `uncheck`, default to `check`) |    🔲     |

##### `click`

Click on an element.

**Abbreviated syntax**

_Argument:_ the selector to use when resolving the DOM element

```yaml
- click: "button[type='submit']"
```

**Explicit syntax**

```yaml
- click:
    selector: "button[type='submit']"
```

| Property   | Type     | Description                                        | Required |
| ---------- | -------- | -------------------------------------------------- | :------: |
| `selector` | `string` | The selector to use when resolving the DOM element |    ☑️     |

##### `fill`

Fill an input or a textarea with a text.

**Abbreviated syntax**

_Argument:_ the selector to use when resolving the DOM element and the value to set (supports templating)

```yaml
- fill: "#search, Eco-design"
```

**Explicit syntax**

```yaml
- fill:
    selector: "#search"
    value: "Eco-design"
```

| Property   | Type     | Description                                                              | Required |
| ---------- | -------- | ------------------------------------------------------------------------ | :------: |
| `selector` | `string` | The selector to use when resolving the DOM element (supports templating) |    ☑️     |
| `value`    | `string` | The value to set (supports templating)                                   |    ☑️     |

##### `goto`

Navigate to the given URL.

**Abbreviated syntax**

_Argument:_ the target HTTP/HTTPS URL (supports templating)

```yaml
- goto: "https://mywebsite.net/admin"
```

**Explicit syntax**

```yaml
- goto:
    url: "https://mywebsite.net/admin"
```

| Property | Type     | Description                                     | Required |
| -------- | -------- | ----------------------------------------------- | :------: |
| `url`    | `string` | The target HTTP/HTTPS URL (supports templating) |    ☑️     |

##### `page`

Mark the current state as a stable page to analyse.

**Abbreviated syntax**

_Argument:_ the page name

```yaml
- page: "Profile page"
```

**Explicit syntax**

```yaml
- page:
    name: "Profile page"
```

| Property | Type     | Description   | Required |
| -------- | -------- | ------------- | :------: |
| `name`   | `string` | The page name |    ☑️     |

##### `procedure`

Execute actions from a procedure.

**Abbreviated syntax**

_Argument:_ the procedure name

```yaml
- procedure: "login"
```

**Explicit syntax**

```yaml
- procedure:
    name: "login"
    args: {"username":"admin"}
```

| Property | Type     | Description         | Required |
| -------- | -------- | ------------------- | :------: |
| `name`   | `string` | The procedure name  |    ☑️     |
| `args`   | `object` | Procedure arguments |    🔲     |

##### `scenario`

Start a scenario (allows to group page audit results).

**Abbreviated syntax**

_Argument:_ the scenario name

```yaml
- scenario: "Browse my profile"
```

**Explicit syntax**

```yaml
- scenario:
    name: "Browse my profile"
    newContext: false
    exclude: false
```

| Property     | Type      | Description                                            | Required |
| ------------ | --------- | ------------------------------------------------------ | :------: |
| `name`       | `string`  | The scenario name                                      |    ☑️     |
| `newContext` | `boolean` | Close the current context and create a new one         |    🔲     |
| `exclude`    | `boolean` | Exclude this scenario from analysis (only run actions) |    🔲     |

##### `screenshot`

Take a screenshot of the current page.

**Abbreviated syntax**

_Argument:_ the file path to save the image to

```yaml
- screenshot: "posts.png"
```

**Explicit syntax**

```yaml
- screenshot:
    path: "posts.png"
```

| Property | Type     | Description                        | Required |
| -------- | -------- | ---------------------------------- | :------: |
| `path`   | `string` | The file path to save the image to |    ☑️     |

##### `scroll`

Scroll an element into view.

**Abbreviated syntax**

_Argument:_ the selector to use when resolving the DOM element

```yaml
- scroll: "#footer"
```

**Explicit syntax**

```yaml
- scroll:
    selector: "#footer"
```

| Property   | Type     | Description                                        | Required |
| ---------- | -------- | -------------------------------------------------- | :------: |
| `selector` | `string` | The selector to use when resolving the DOM element |    ☑️     |

##### `select`

Select option or options in select.

**Abbreviated syntax**

_Argument:_ the selector to use when resolving the DOM element and option(s) to select

```yaml
- select: "select[name='lang'], fr"
```

**Explicit syntax**

```yaml
- select:
    selector: "select[name='lang']"
    value: "fr"
    values: ["fr","en"]
```

| Property   | Type     | Description                                        | Required |
| ---------- | -------- | -------------------------------------------------- | :------: |
| `selector` | `string` | The selector to use when resolving the DOM element |    ☑️     |
| `value`    | `string` | The option to select                               |    🔘     |
| `values`   | `array`  | Options to select                                  |    🔘     |

##### `upload`

Select input files for upload.

**Abbreviated syntax**

_Argument:_ the selector to use when resolving the DOM element and input file(s) to set

```yaml
- upload: "input[name='file'], myfile.txt"
```

**Explicit syntax**

```yaml
- upload:
    selector: "select[name='lang']"
    file: "myfile.txt"
    files: ["myfile1.txt","myfile2.txt"]
```

| Property   | Type     | Description                                        | Required |
| ---------- | -------- | -------------------------------------------------- | :------: |
| `selector` | `string` | The selector to use when resolving the DOM element |    ☑️     |
| `file`     | `string` | The input file to set                              |    🔘     |
| `files`    | `array`  | Input files to set                                 |    🔘     |

##### `wait`

Wait for the required load state to be reached or for an element to be visible.

**Abbreviated syntax**

_Argument:_ the load state to wait for (`load`, `domcontentloaded`, `networkidle`)

```yaml
- wait: "load"
```

_Argument:_ the selector to use when resolving the DOM element

```yaml
- wait: "main#container"
```

**Explicit syntax**

```yaml
- wait:
    state: "load"
    selector: "main#container"
```

| Property   | Type     | Description                                        | Required |
| ---------- | -------- | -------------------------------------------------- | :------: |
| `state`    | `string` | The load state to wait for                         |    🔘     |
| `selector` | `string` | The selector to use when resolving the DOM element |    🔘     |

#### Procedures

Procedures allow to define reusable sequences of actions.

Define a procedure with a unique name under the `procedures` key:

```yaml
procedures:
  # Log a user in using the login form page
  login:
    - page: "Login page for {{ args.username }}"
    - fill: { selector: "#username", value: "{{ args.username }}" }
    - fill: { selector: "#password", value: "{{ args.password }}" }
    - click: button[type="submit"]
```

Call it from the browsing scenario using the [`procedure`](#procedure) action:

```yaml
actions:
  - ...
  - procedure:
      name: login
      args: { username: user, password: "{{ env.USER_PASSWORD }}" }
  - ...
```
<!-- </manifest> -->

### Report

Audit results can be exported using various report formats that can be specified
using the `formats` CLI flag, environment variable or manifest configuration
key.

| Format | Description                                                                                                |
| ------ | ---------------------------------------------------------------------------------------------------------- |
| `html` | Export analysis results to an HTML report file<br>→ Recommended for simple analysis result visualisation   |
| `json` | Export analysis results to a JSON report file<br>→ Recommended for further data analysis and visualisation |

### Continuous Integration

Audits can be executed in CI environments:

1. Use the Playwright Docker image in a Linux agent:
   `mcr.microsoft.com/playwright`

| Provider            | Configuration key                  |
| ------------------- | ---------------------------------- |
| **GitHub Actions**  | `jobs.<job_id>.container`          |
| **GitLab**          | `<job_id>.image`                   |
| **Azure Pipelines** | `container` or `jobs[*].container` |

2. Install project dependencies, including _Ecojourney_:

```shell
npm ci
```

3. Run the audit:

```shell
npx ecojourney audit [...]
```

✔️ **Best practices:**

- Running the audit on each commit is usually wasteful, it should preferably
  be executed manually or on specific events (main branch, release, ...)
- Don't forget to cache dependencies (Docker image, `node_modules` / NPM cache,
  ...)

## Analysers

Each page from the browsing scenario is analysed by a list of analysers, each
one collecting metrics and identifying issues regarding eco-design best
practices.

<!-- <analysers> -->
### Cache (`cache`)

Check cache headers

#### Rules

| Id                        | Name                    | Description                                                                                                                     |
| ------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `configure-cache-headers` | Configure cache headers | Configure cache headers on static resources to enable HTTP caching (Cache-Control with a large max-age, ETag and Last-Modified) |

### Cookies (`cookies`)

Check cookies

#### Rules

| Id                              | Name                          | Description                                                 |
| ------------------------------- | ----------------------------- | ----------------------------------------------------------- |
| `optimise-cookies`              | Optimise cookies size         | Optimise cookies size and remove them when they are useless |
| `no-cookie-for-static-resource` | No cookie for static resource | Host static resource on a domain without cookie             |

### EcoIndex (`ecoindex`)

EcoIndex and related metrics calculation and analysis

#### Metrics

| Id                          | Name                | Description                      |
| --------------------------- | ------------------- | -------------------------------- |
| `eco-index`                 | EcoIndex            | The EcoIndex                     |
| `requests-count`            | Requests            | The number of HTTP requests      |
| `responses-size`            | Responses size      | The total size of HTTP responses |
| `dom-elements-count`        | DOM elements        | The number of DOM elements       |
| `greenhouse-gases-emission` | 🌫️ GhG emission      | The greenhouse gases emission    |
| `water-consumption`         | 💧 Water consumption | The water consumption            |
| `redirections-count`        | Redirections        | The number of HTTP redirections  |

#### Rules

| Id                      | Name                  | Description                                                                          |
| ----------------------- | --------------------- | ------------------------------------------------------------------------------------ |
| `reduce-requests-count` | Reduce requests count | Reduce the number of requests                                                        |
| `reduce-responses-size` | Reduce responses size | Reduce the responses size                                                            |
| `reduce-dom-size`       | Reduce DOM size       | Reduce the number of elements in the DOM                                             |
| `avoid-redirections`    | Avoid redirections    | Avoid redirections as they increase response time and resource consumption uselessly |

### Fonts (`fonts`)

Check for fonts

#### Metrics

| Id                     | Name                | Description                      |
| ---------------------- | ------------------- | -------------------------------- |
| `external-fonts-count` | External fonts      | The number of external fonts     |
| `external-fonts-size`  | External fonts size | The total size of external fonts |

#### Rules

| Id                   | Name               | Description                                       |
| -------------------- | ------------------ | ------------------------------------------------- |
| `use-standard-fonts` | Use standard fonts | Use fonts already pre-installed on user terminals |

### Images (`images`)

Check images

#### Metrics

| Id                    | Name               | Description                     |
| --------------------- | ------------------ | ------------------------------- |
| `raster-images-count` | Raster images      | The number of raster images     |
| `raster-images-size`  | Raster images size | The total size of raster images |
| `vector-images-count` | Vector images      | The number of vector images     |
| `vector-images-size`  | Vector images size | The total size of vector images |

#### Rules

| Id                        | Name                    | Description                                                                                                                                  |
| ------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `optimise-image`          | Optimise image          | Replace raster images with CSS, font glyphs or vector images when possible, otherwise use the right format (WebP, AVIF, PNG) and compression |
| `optimise-vector-image`   | Optimise vector image   | Optimise and minimise SVG images                                                                                                             |
| `serve-right-sized-image` | Serve right-sized image | Serve pre-resized image instead of resizing browser-side                                                                                     |

### Scripts (`scripts`)

Check scripts

#### Metrics

| Id                       | Name                  | Description                        |
| ------------------------ | --------------------- | ---------------------------------- |
| `external-scripts-count` | External scripts      | The number of external scripts     |
| `external-scripts-size`  | External scripts size | The total size of external scripts |
| `embedded-scripts-count` | Embedded scripts      | The number of embedded scripts     |
| `embedded-scripts-size`  | Embedded scripts size | The total size of embedded scripts |

#### Rules

| Id                     | Name                 | Description                                        |
| ---------------------- | -------------------- | -------------------------------------------------- |
| `externalise-script`   | Externalise script   | Avoid embedding script into the HTML page          |
| `minify-script`        | Minify script        | Reduce the size of the script by minifying JS code |
| `reduce-scripts-count` | Reduce scripts count | Reduce the number of scripts                       |
| `reduce-script-size`   | Reduce script size   | Reduce the size of the script                      |

### Style sheets (`stylesheets`)

Check style sheets

#### Metrics

| Id                      | Name                 | Description                       |
| ----------------------- | -------------------- | --------------------------------- |
| `external-styles-count` | External styles      | The number of external styles     |
| `external-styles-size`  | External styles size | The total size of external styles |
| `embedded-styles-count` | Embedded styles      | The number of embedded styles     |
| `embedded-styles-size`  | Embedded styles size | The total size of embedded styles |

#### Rules

| Id                    | Name                | Description                                              |
| --------------------- | ------------------- | -------------------------------------------------------- |
| `externalise-style`   | Externalise style   | Avoid embedding style sheet into the HTML page           |
| `minify-style`        | Minify style        | Reduce the size of the style sheet by minifying CSS code |
| `provide-print-style` | Provide print style | Optimise styles for printing                             |
| `reduce-styles-count` | Reduce styles count | Reduce the number of style sheets                        |
| `reduce-style-size`   | Reduce style size   | Reduce the size of the style sheet                       |
<!-- </analysers> -->

## License

**Ecojourney** is licensed under the GNU General Public License.
