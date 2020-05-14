# **pysami**

Django backend for sami web tool

## About

This branch includes the sami-mgr Angular front end

### Requirements

**_Git https://git-scm.com
Python v3.8+ https://www.python.org and/or Anaconda https://www.anaconda.com
node.js https://nodejs.org_**

### Development Setup

A fairly efficient development setup is as follows:

- Open an Anaconda cli instance

- Create an environment

  > `(base) C:\Users\user>conda create env -n sami django`

- Activate the environment:

  > `(base) C:\Users\user>conda activate sami` > `(sami) C:\Users\user>`

- Make a workspace folder:

  > `(sami) C:\Users\user>mkdir ws-sami`

- `cd` into the workspace:

  > `(sami) C:\Users\user>cd ws-sami`

- Clone the repo:

  > `(sami) ..\ws-sami>git clone https://www.github.com/jeastwest/pysami.git`

- `cd` into the project:

  > `(sami) C:\Users\user\ws-sami>cd pysami`

- Checkout the sami-ng-included-in-pysami branch

  > `(sami) ..\ws-sami\pysami>git checkout sami-ng-included-in-pysami`

- Cd into the src folder:

  > `(sami) ..\ws-sami\pysami>cd src`

- Install the python dependencies:

  > `(sami) ..\ws-sami\pysami\src>pip install -r requirements.txt`

- Cd into the sami_angular/sami-mgr folder:

  > `(sami) ..\sami-mgr>cd ../sami_angular/sami-mgr`

- Install the angular dependencies:
  > `(sami) ..\sami-mgr>npm install`

At this point all requirements should be installed

- In order for pysami (Django) to be able to serve the angular files they need to be built first
  The following command will build the angular files, create the src/static folder, and save the
  built files within
  > `(sami) ..\sami-mgr>npx ng build --prod --output-path C:\Users\user\ws-sami\pysami\src\static --watch --output-hashing none`

-- the npx command tells node to use the angular installed in the node_modules folder instead of a global one
-- ng build is the standard angular build command
-- --prod instructs the compiler to build a production version of the Angular app
-- --output-path tells the compiler where to save the built files
-- --watch starts a file monitor which reruns this build command if any of the source files change, basically hot-reloading
-- --output-hashing none instructs the compiler not to append the file names with the file's hash

-- Building the Angular files this way leaves this anaconda cli instance blocking as a log for the file monitor

-- Open another anaconda cli instance, activate the environment you created earlier, and navigate to the pysami project src folder:
-- (base) C:\Users\user>conda activate sami
-- (sami) C:\Users\user>cd ws-sami/pysami/src

-- Start the Django app:
-- (sami) C:\Users\user\ws-sami\pysami\src>python manage.py runserver

-- You can now navigate a browser to localhost:8000

-- Note: If you have followed this set up procedure, you have a good way to easily test iterations of the Angular components of this app,
-- but this method can be slow, build time being the restriction.
-- An addition to this setup that can speed up iterations of the front end is by starting another terminal (I use the one in vscode for this)
-- and starting an additional angular development server there.
-- C:\Users\user>cd ws-sami\pysami\src\sami_angular\sami-mgr>npx ng serve

-- This will start the Angular development server on port 4200, which is much faster to iterate with.
-- You can now navigate a browser to localhost:4200
