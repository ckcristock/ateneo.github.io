export interface Permissions {
  menu: string;
  permissions: {
    approve?: boolean;
    close?: boolean;
    open?: boolean;
    show?: boolean;
    add?: boolean;
    edit?: boolean;
    receive_calls?: boolean;
    show_all?: boolean;
    approve_product_categories?: boolean;
    engineering_and_design?: boolean;
    production?: boolean;
    financial?: boolean;
    modify_hours?: boolean;
    all_companies?: boolean;
  };
}
