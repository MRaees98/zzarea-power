# Vagrantfile

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/bionic64"
  config.vm.network "forwarded_port", guest: 8088, host: 8088

  config.vm.provision "shell", inline: <<-SHELL
    # Update and install necessary packages
    sudo apt-get update
    sudo apt-get install -y build-essential libssl-dev libffi-dev python3-dev python3-pip libsasl2-dev libldap2-dev default-libmysqlclient-dev

    # Upgrade setuptools and pip
    pip install --upgrade setuptools pip

    # Install virtualenv
    pip install virtualenv

    # Install python3-venv
    sudo apt-get install -y python3-venv

    # Create and activate virtual environment
    python3 -m venv venv
    source venv/bin/activate

    # Install Apache Superset
    pip install apache-superset

    # Set Flask app environment variable
    export FLASK_APP=superset

    # Generate SECRET_KEY
    export SUPERSET_SECRET_KEY=$(openssl rand -base64 42)

    # Upgrade Superset database
    superset db upgrade

    # Create admin user
    superset fab create-admin --username admin --password admin --firstname Admin --lastname User --email admin@example.com

    # Load examples and initialize Superset
    superset load_examples
    superset init

    # Run Superset server
    superset run -h 0.0.0.0 -p 8088 --with-threads --reload --debugger
  SHELL
end

