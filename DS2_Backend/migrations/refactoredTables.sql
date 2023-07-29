CREATE TABLE accounts(
     account_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     account_name varchar(100) NOT NULL,
     account_type varchar(50) NOT NULL,
     is_account_active boolean NOT NULL,
     account_statement varchar(255),
     account_interest_statement varchar(255),
     account_invoice_interest_rate decimal(10, 2),
     account_invoice_template_option varchar(100),
     account_company_logo bytea,
     created_at timestamp DEFAULT NOW()
);

CREATE TABLE account_information(
     account_info_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     account_id integer NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
     account_street varchar(255),
     account_city varchar(100),
     account_state varchar(2),
     account_zip varchar(10),
     account_email varchar(255),
     account_phone varchar(20),
     is_this_address_active boolean NOT NULL,
     is_account_physical_address boolean NOT NULL,
     is_account_billing_address boolean NOT NULL,
     is_account_mailing_address boolean NOT NULL,
     created_at timestamp DEFAULT NOW()
);

CREATE TABLE users(
     user_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     account_id integer NOT NULL REFERENCES accounts(account_id),
     email varchar(255) NOT NULL,
     display_name varchar(100) NOT NULL,
     cost_rate decimal(10, 2),
     billing_rate decimal(10, 2),
     job_title varchar(50) NOT NULL,
     access_level varchar(50) NOT NULL,
     last_login_date timestamp DEFAULT NOW(),
     login_ip varchar(50),
     is_user_active boolean NOT NULL DEFAULT TRUE,
     created_at timestamp DEFAULT NOW()
);

CREATE TABLE user_login(
     user_login_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     account_id integer NOT NULL REFERENCES accounts(account_id),
     user_id integer NOT NULL REFERENCES users(user_id),
     user_name varchar(100) NOT NULL,
     password_hash varchar(255) NOT NULL,
     is_login_active boolean NOT NULL DEFAULT TRUE,
     created_at timestamp DEFAULT NOW(),
     updated_at timestamp DEFAULT NOW()
);

CREATE TABLE customers(
     customer_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     account_id integer NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
     business_name varchar(100),
     customer_name varchar(100) NOT NULL,
     display_name varchar(100) NOT NULL,
     is_commercial_customer boolean NOT NULL,
     is_customer_active boolean NOT NULL,
     is_billable boolean NOT NULL,
     is_recurring boolean NOT NULL,
     created_at timestamp DEFAULT NOW()
);

CREATE TABLE customer_information(
     customer_info_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     account_id integer NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
     customer_id integer NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
     customer_street varchar(255),
     customer_city varchar(100),
     customer_state varchar(2),
     customer_zip varchar(10),
     customer_email varchar(255),
     customer_phone varchar(20),
     is_this_address_active boolean NOT NULL,
     is_customer_physical_address boolean NOT NULL,
     is_customer_billing_address boolean NOT NULL,
     is_customer_mailing_address boolean NOT NULL,
     created_by_user_id integer NOT NULL REFERENCES users(user_id),
     created_at timestamp DEFAULT NOW()
);

CREATE TABLE recurring_customers(
     recurring_customer_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     account_id integer NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
     customer_id integer REFERENCES customers(customer_id) ON DELETE CASCADE,
     subscription_frequency varchar(255) NOT NULL,
     bill_on_date integer NOT NULL,
     recurring_bill_amount DECIMAL(10, 2) NOT NULL,
     start_date date NOT NULL,
     end_date date NULL,
     is_recurring_customer_active boolean NOT NULL,
     created_by_user_id integer NOT NULL REFERENCES users(user_id)
);

CREATE TABLE customer_job_categories(
     customer_job_category_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     account_id integer NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
     customer_job_category varchar NULL,
     is_job_category_active boolean NOT NULL,
     created_at timestamp DEFAULT NOW(),
     created_by_user_id integer NOT NULL REFERENCES users(user_id)
);

CREATE TABLE customer_job_types(
     job_type_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     account_id integer NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
     customer_job_category_id integer NULL REFERENCES customer_job_categories(customer_job_category_id),
     job_description varchar NOT NULL,
     book_rate integer NULL,
     estimated_straight_time integer NULL,
     is_job_type_active boolean NOT NULL,
     created_at timestamp DEFAULT NOW(),
     created_by_user_id integer NOT NULL REFERENCES users(user_id)
);

CREATE TABLE customer_jobs(
     customer_job_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     parent_job_id integer NULL,
     account_id integer NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
     customer_id integer REFERENCES customers(customer_id) ON DELETE CASCADE,
     job_type_id integer NOT NULL REFERENCES customer_job_types(job_type_id),
     job_quote_amount DECIMAL(10, 2) NULL,
     agreed_job_amount DECIMAL(10, 2) NULL,
     current_job_total DECIMAL(10, 2) NULL,
     job_status DECIMAL(10, 2) NULL,
     is_job_complete boolean NULL,
     is_quote boolean NOT NULL,
     created_at timestamp DEFAULT NOW(),
     created_by_user_id integer NOT NULL REFERENCES users(user_id),
     notes text
);

CREATE TABLE customer_quotes(
     customer_quote_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     account_id integer NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
     customer_id integer NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
     customer_job_id integer REFERENCES customer_jobs(customer_job_id),
     amount_quoted DECIMAL(10, 2) NOT NULL,
     is_quote_active boolean NOT NULL,
     created_at timestamp DEFAULT NOW(),
     created_by_user_id integer NOT NULL REFERENCES users(user_id),
     notes text
);

CREATE TABLE customer_invoices(
     customer_invoice_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     parent_invoice_id integer NULL,
     account_id integer NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
     customer_id integer NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
     customer_info_id integer NOT NULL REFERENCES customer_information(customer_info_id),
     invoice_number varchar(100),
     invoice_date date NOT NULL,
     due_date date NOT NULL,
     beginning_balance decimal(10, 2) NOT NULL,
     total_payments decimal(10, 2) NOT NULL,
     total_charges decimal(10, 2) NOT NULL,
     total_write_offs decimal(10, 2) NOT NULL,
     total_retainers decimal(10, 2) NOT NULL,
     total_amount_due decimal(10, 2) NOT NULL,
     remaining_balance_on_invoice integer,
     is_invoice_paid_in_full boolean NOT NULL,
     fully_paid_date date NULL,
     created_at timestamp DEFAULT NOW(),
     created_by_user_id integer NOT NULL REFERENCES users(user_id),
     start_date date NULL,
     end_date date NULL,
     notes text
);

CREATE TABLE customer_invoice_snapshot(
     customer_invoice_snapshot_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     account_id integer NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
     customer_id integer NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
     customer_invoice_id integer NOT NULL REFERENCES customer_invoices(customer_invoice_id),
     appears_on_invoice_id integer NOT NULL,
     amount_due decimal(10, 2) NOT NULL,
     invoice_date date NOT NULL,
     created_at timestamp DEFAULT NOW()
);

CREATE TABLE customer_transactions(
     transaction_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     account_id integer NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
     customer_id integer NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
     customer_job_id integer REFERENCES customer_jobs(customer_job_id),
     customer_invoice_id integer NULL,
     logged_for_user_id integer NOT NULL REFERENCES users(user_id),
     detailed_work_description text,
     transaction_date date NOT NULL,
     transaction_type varchar(50) NOT NULL,
     quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
     unit_cost DECIMAL(10, 2) NOT NULL,
     total_transaction DECIMAL(10, 2) NOT NULL,
     is_transaction_billable boolean NOT NULL,
     is_excess_to_subscription boolean NOT NULL,
     created_at timestamp DEFAULT NOW(),
     created_by_user_id integer NOT NULL REFERENCES users(user_id)
);

CREATE TABLE customer_payments(
     payment_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     customer_id integer NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
     account_id integer NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
     customer_job_id integer NULL,
     retainer_id integer NULL,
     customer_invoice_id integer NULL,
     payment_date date NOT NULL,
     payment_amount DECIMAL(10, 2) NOT NULL,
     form_of_payment varchar(50),
     payment_reference_number varchar(50),
     is_transaction_billable boolean NOT NULL DEFAULT TRUE,
     created_at timestamp DEFAULT NOW(),
     created_by_user_id integer NOT NULL REFERENCES users(user_id),
     note text
);

CREATE TABLE customer_writeOffs(
     writeoff_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     customer_id integer NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
     account_id integer NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
     customer_invoice_id integer NULL,
     customer_job_id integer NULL,
     writeoff_date date NOT NULL,
     writeoff_amount DECIMAL(10, 2) NOT NULL,
     transaction_type varchar(50) NOT NULL,
     writeoff_reason varchar(50) NOT NULL,
     created_at timestamp DEFAULT NOW(),
     created_by_user_id integer NOT NULL REFERENCES users(user_id),
     note text
);

CREATE TABLE customer_adjustments(
     adjustment_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     customer_id integer NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
     account_id integer NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
     customer_invoice_id integer NULL,
     transaction_id integer NULL,
     customer_job_id integer NULL,
     adjustment_date date NOT NULL,
     adjustment_amount DECIMAL(10, 2) NOT NULL,
     transaction_type varchar(50) NOT NULL,
     created_at timestamp DEFAULT NOW(),
     created_by_user_id integer NOT NULL REFERENCES users(user_id),
     note text
);

CREATE TABLE customer_retainers_and_prepayments(
     retainer_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     parent_retainer_id integer NULL,
     customer_id integer NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
     account_id integer NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
     type_of_hold varchar(50) NOT NULL,
     starting_amount DECIMAL(10, 2) NOT NULL,
     current_amount DECIMAL(10, 2) NOT NULL,
     form_of_payment varchar(50),
     payment_reference_number varchar(50),
     is_retainer_active boolean NOT NULL,
     created_at timestamp DEFAULT NOW(),
     created_by_user_id integer NOT NULL REFERENCES users(user_id),
     note text
);

CREATE TABLE customer_notes(
     customer_note_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     customer_id integer NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
     account_id integer NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
     is_note_active boolean NOT NULL,
     created_at timestamp DEFAULT NOW(),
     created_by_user_id integer NOT NULL REFERENCES users(user_id),
     clearance_level varchar(50) NOT NULL,
     note_title varchar(100) NOT NULL,
     note text
);

