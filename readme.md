# DSA NOLA Website

## Requirements
* Ruby
    
    * Debian / Ubuntu
    ```bash
    sudo apt-get install ruby ruby-dev gcc make
    sudo gem install jekyll
    ```
    * Windows (requires Chocolatey package manager)
    ```powershell
    choco install ruby
    choco install ruby2.devkit
    gem install jekyll
    ```
## Building
    ```
    jekyll build
    ```
## Serving 
    ```
    jekyll serve --watch
    ```

## DSA Calendar Widget (already setup - skip this part)

To get this working:

* Using the google account with the calendar, go to https://console.developers.google.com and create a project
* Enable the google calendar API
* Go to credentials and create an API key, with a referrer key restriction to http://dsaneworleans.org/ or wherever you want the page to live
* Plop that API key in the script
* Make sure the calendar is set to public, and find the calendar id (there's probably a better way, but on my test setup I just went calendar settings -> embed and the id is in the embed code, should look like q9d5kvi60fj6m34ml77a6hdc@group.calendar.google.com). Add it to the script.

Note that I didn't add the header/footer/etc and all the styles are just inline in the header- figured whoever is handling that stuff should be able to copy/paste all that in, add the cal link to the nav, etc. Also no pagination or anything- lmk if there's like elevntybillion events and we need to implement that.