# **pysami**
Django backend for sami web tool with Angular frontend served as a SPA (single-page-application) from Django.

## About
Deployable stack for serving the SAMI web-app.


### Requirements

#### **_Git https://git-scm.com_**

#### **_Python v3.8+ https://www.python.org and/or Anaconda https://www.anaconda.com_**

#### **_node.js https://nodejs.org_**


### Development Setup

A fairly efficient development setup for a Windows 10 machine is as follows:

- Open an Anaconda cli instance

- Create an environment

  > `(base) C:\Users\user>conda create env -n sami django`

- Activate the environment:

  > `(base) C:\Users\user>conda activate sami`

  > `(sami) C:\Users\user>`

- Make a workspace folder:

  > `(sami) C:\Users\user>mkdir ws-sami`

- `cd` into the workspace:

  > `(sami) C:\Users\user>cd ws-sami`

- Clone the repo:

  > `(sami) ..\ws-sami>git clone https://www.github.com/jeastwest/pysami.git`

- `cd` into the project's src folder:

  > `(sami) C:\Users\user\ws-sami>cd pysami\src`

- Install the python dependencies (this might take a while):

  > `(sami) ..\ws-sami\pysami\src>pip install -r requirements.txt`

- `cd` into the sami_angular/sami-mgr folder:

  > `(sami) \ws-sami\pysami\src>cd ../sami_angular/sami-mgr`

- Install the angular dependencies (this also might take a while):

  > `(sami) ..\sami_angular\sami-mgr>npm install`


At this point all requirements should be installed.


#### Start the Django server:

- navigate to the pysami project src folder:

> `(base) C:\Users\user>conda activate sami`

> `(sami) C:\Users\user>cd ws-sami/pysami/src`

- Migrate any database changes:

> `(sami) C:\Users\user\ws-sami\pysami\src>python manage.py migrate`

- Start the Django app:

> `(sami) C:\Users\user\ws-sami\pysami\src>python manage.py runserver`

- You can now navigate a browser to `localhost:8000`

- Until you build the Angular files and deploy them to the correct directory (see below), only the API will be available


#### Start the Angular development server:

- Navigate to the Angular project root directory:.

> `C:\Users\user>cd ws-sami\pysami\src\sami_angular\sami-mgr>npx ng serve`

- This will start the Angular development server on port 4200.

- You can now navigate a browser to `localhost:4200`


### Deployment:

In order for pysami (Django) to be able to serve the angular files they need to be built first.

  The following command will build the angular files, create the src/static folder, if it doesn't exist already, and save the
  built Angular files within. The `--watch` command monitors file states and reissues the build command on file changes. It will also leave the terminal it is issued within blocking, and acting similarly to the Angular dev-server or the like the node module **_nodemon https://nodemon.io_**.

  > `(sami) ..\sami-mgr>npx ng build --prod --output-path C:\Users\user\ws-sami\pysami\src\static --watch --output-hashing none`

The npx command tells node to use the angular version installed in the node_modules folder instead of a globaly installed one.

These are the optional flag definitions:

- `ng build` is the standard angular build command
- `--prod` instructs the compiler to build a production version of the Angular app
- `--output-path` tells the compiler where to save the built files
- `--watch` starts a file monitor which reruns this build command if any of the source files change, basically hot-reloading
- `--output-hashing none` instructs the compiler not to append the file names with the file's hash

(I usually issue this command from the terminal in VS Code, so I can monitor the build log when I update code)
