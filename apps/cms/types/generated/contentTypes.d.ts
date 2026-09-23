import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    adminPermissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::permission'
    >;
    adminUserOwner: Schema.Attribute.Relation<'manyToOne', 'admin::user'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    expiresAt: Schema.Attribute.DateTime;
    kind: Schema.Attribute.Enumeration<['content-api', 'admin']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'content-api'>;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    apiToken: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminSession extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_sessions';
  info: {
    description: 'Session Manager storage';
    displayName: 'Session';
    name: 'Session';
    pluralName: 'sessions';
    singularName: 'session';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
    i18n: {
      localized: false;
    };
  };
  attributes: {
    absoluteExpiresAt: Schema.Attribute.DateTime & Schema.Attribute.Private;
    childId: Schema.Attribute.String & Schema.Attribute.Private;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deviceId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    expiresAt: Schema.Attribute.DateTime &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::session'> &
      Schema.Attribute.Private;
    metadata: Schema.Attribute.JSON & Schema.Attribute.Private;
    origin: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sessionId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique;
    status: Schema.Attribute.String & Schema.Attribute.Private;
    type: Schema.Attribute.String & Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    userId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    apiTokens: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordTokenExpiresAt: Schema.Attribute.DateTime &
      Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiAcademicCalendarPageAcademicCalendarPage
  extends Struct.SingleTypeSchema {
  collectionName: 'academic_calendar_page';
  info: {
    description: 'The prose and card content of /academics/academic-calendar/ \u2014 everything on that page that is NOT one of the calendar documents themselves. A Single Type because there is exactly one such page; the calendars it lists are a Collection Type beside it.';
    displayName: 'Academic Calendar Page';
    pluralName: 'academic-calendar-pages';
    singularName: 'academic-calendar-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    carries: Schema.Attribute.Component<'shared.point', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::academic-calendar-page.academic-calendar-page'
    > &
      Schema.Attribute.Private;
    planning: Schema.Attribute.Component<'shared.point', true>;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    shots: Schema.Attribute.Component<'shared.photo', true>;
    source: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAcademicTopicAcademicTopic
  extends Struct.CollectionTypeSchema {
  collectionName: 'academic_topics';
  info: {
    description: "ONE RECORD PER ACADEMICS PAGE \u2014 all 46 of them, from the /academics/ overview down to each stage, stream, policy and partnership page. Replaces data/academics.ts, academicTopics.ts, teachingTopics.ts, studentSuccess.ts and parentsForum.ts, and the several hundred content consts that were declared inside the page components themselves. \u26A0\u26A0 THIS REPLACES THE CONTENT SOURCE, NOT THE DESIGNS. Every academics page keeps its own bespoke layout, markup, GSAP timeline, scoped CSS, responsive behaviour, section keys and URL. A page reads `section('steps').points` where it used to read a local const, and nothing below that line changes. \u26A0 `route` IS THE URL AND IS THE KEY. It is what the page looks itself up by, and every one of them is a published address \u2014 changing it orphans the page and breaks any link to it. \u26A0 `owed` MARKS A TOPIC THE SCHOOL PUBLISHES NOTHING ON. The page then says so rather than being padded to length: a school site that invents a scholarship or a success story does real damage. `existing` marks a topic whose destination was already a page of its own.";
    displayName: 'Academic Topic';
    pluralName: 'academic-topics';
    singularName: 'academic-topic';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    body: Schema.Attribute.Component<'shared.paragraph', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    existing: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    group: Schema.Attribute.Enumeration<
      [
        'overview',
        'philosophy',
        'structure',
        'teaching-learning',
        'assessment',
        'student-success',
        'parent-partnership',
      ]
    > &
      Schema.Attribute.Required;
    hint: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::academic-topic.academic-topic'
    > &
      Schema.Attribute.Private;
    owed: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    photoKey: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    photos: Schema.Attribute.Component<'shared.photo', true>;
    points: Schema.Attribute.Component<'shared.point', true>;
    publishedAt: Schema.Attribute.DateTime;
    route: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    sections: Schema.Attribute.Component<'shared.section', true>;
    slug: Schema.Attribute.UID<'label'> & Schema.Attribute.Required;
    standfirst: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAchievementMajorAchievementMajor
  extends Struct.CollectionTypeSchema {
  collectionName: 'achievement_majors';
  info: {
    description: "The award-graphic achievements shown at full size. Mirrors the `majors` export of apps/web/src/data/achievements.ts \u2014 the three the school itself produced an award graphic for, which is the school's own editorial decision rather than ours.";
    displayName: 'Major Achievement';
    pluralName: 'achievement-majors';
    singularName: 'achievement-major';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    art: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    detail: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    facts: Schema.Attribute.Component<'shared.fact', true>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::achievement-major.achievement-major'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAchievementRecordAchievementRecord
  extends Struct.CollectionTypeSchema {
  collectionName: 'achievement_records';
  info: {
    description: 'One line of the full record, sporting or academic. Mirrors the `sportRecord` and `academicRecord` exports of apps/web/src/data/achievements.ts.';
    displayName: 'Achievement Record';
    pluralName: 'achievement-records';
    singularName: 'achievement-record';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    category: Schema.Attribute.Enumeration<['sport', 'academic']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'sport'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::achievement-record.achievement-record'
    > &
      Schema.Attribute.Private;
    meta: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAchievementsPageAchievementsPage
  extends Struct.SingleTypeSchema {
  collectionName: 'achievements_pages';
  info: {
    description: 'The three band headings on Beyond Academics \u2192 Achievements. \u26A0 THIS IS THE PAGE FURNITURE ONLY \u2014 the achievements themselves live in three separate collections: Achievement Majors, Credentials and Achievement Records. Editing a heading here never changes what is listed under it. \u26A0 THE BANNER, PAGE TITLE AND SEO ARE NOT HERE EITHER \u2014 they are on the Page Meta row for /beyond-academics/achievements/, which is where every page on the site keeps them, banner upload included.';
    displayName: 'Achievements Page';
    pluralName: 'achievements-pages';
    singularName: 'achievements-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::achievements-page.achievements-page'
    > &
      Schema.Attribute.Private;
    majors: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    recognition: Schema.Attribute.Component<'structure.section', false>;
    record: Schema.Attribute.Component<'structure.section', false>;
    recordBoards: Schema.Attribute.Component<
      'achievements.record-board',
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          max: 2;
        },
        number
      >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAdvisoryCouncilAdvisoryCouncil
  extends Struct.SingleTypeSchema {
  collectionName: 'advisory_council';
  info: {
    description: "The board that closes /about/history-legacy/. \u26A0\u26A0 THIS IS NOT THE STUDENT COUNCIL AND NOT THE SCHOOL MANAGEMENT COMMITTEE. Three different bodies, and this CMS holds all three separately: the STUDENT council is children (Student Council); the SMC is the statutory CBSE filing (Disclosure Page); this is a panel of academics, officials and the group's own directors that the school chose. Do not merge them. \u26A0\u26A0 ITS OWN RECORD RATHER THAN A FIELD ON HISTORY PAGE, ON PURPOSE: History Page is rewritten whole by `npm run seed:pages`, so anything added there would be restored to the fixture by a seed run meant for something else. \u26A0 IT IS A SEPARATE SINGLE TYPE BUT NOT A SEPARATE PAGE \u2014 audit 1.11 says dignitaries belong inside the History section rather than behind a new menu link.";
    displayName: 'Advisory Council';
    pluralName: 'advisory-councils';
    singularName: 'advisory-council';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    advisors: Schema.Attribute.Component<'council.advisor', true>;
    board: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::advisory-council.advisory-council'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAlumniMeetAlumniMeet extends Struct.CollectionTypeSchema {
  collectionName: 'alumni_meets';
  info: {
    description: "A reunion with its photo gallery. Mirrors the `alumniMeets` export of apps/web/src/data/alumniMeets.ts. NOTE: the source's `published` boolean is NOT a field here \u2014 it maps onto Strapi's own draft/publish state, so an unpublished meet is a draft rather than a published row carrying a flag the API would still return.";
    displayName: 'Alumni Meet';
    pluralName: 'alumni-meets';
    singularName: 'alumni-meet';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cover: Schema.Attribute.Media<'images'>;
    coverAlt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Component<'shared.paragraph', true>;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    featured: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    gallery: Schema.Attribute.Component<'shared.photo', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::alumni-meet.alumni-meet'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    session: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    source: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAlumniRegistrationAlumniRegistration
  extends Struct.CollectionTypeSchema {
  collectionName: 'alumni_registrations';
  info: {
    description: "A former student registering through the form on /alumni/registration/. WRITTEN BY VISITORS, NOT BY EDITORS \u2014 nothing here is authored in the admin panel, and no page on the site reads it back. Fields mirror the form's own inputs one-for-one; see apps/web/src/components/alumni/ArForm.astro and the field list in apps/web/src/data/alumniRegistration.ts. draftAndPublish is OFF because a registration is a record of something that happened, not a document with a draft state.";
    displayName: 'Alumni Registration';
    pluralName: 'alumni-registrations';
    singularName: 'alumni-registration';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    classCompleted: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    consent: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::alumni-registration.alumni-registration'
    > &
      Schema.Attribute.Private;
    location: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    message: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 4000;
      }>;
    mobile: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    officeNotes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 5000;
      }>;
    organisation: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    passingYear: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10;
      }>;
    profession: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    sourcePage: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    status: Schema.Attribute.Enumeration<['new', 'read', 'replied', 'closed']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'new'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAlumniStoryAlumniStory extends Struct.CollectionTypeSchema {
  collectionName: 'alumni_stories';
  info: {
    description: "An alumnus profile with quote and narrative. Mirrors the `alumniStories` export of apps/web/src/data/alumniMeets.ts. As with Alumni Meet, the source's `published` boolean maps onto Strapi's draft/publish state rather than becoming a field.";
    displayName: 'Alumni Story';
    pluralName: 'alumni-stories';
    singularName: 'alumni-story';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    batch: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    featured: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    gallery: Schema.Attribute.Component<'shared.photo', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::alumni-story.alumni-story'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    organisation: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    photo: Schema.Attribute.Media<'images'>;
    photoAlt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    profession: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    quote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    story: Schema.Attribute.Component<'shared.paragraph', true>;
    study: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAlumnusAlumnus extends Struct.CollectionTypeSchema {
  collectionName: 'alumni';
  info: {
    description: 'One alumni placement card. Mirrors the `alumni` export of apps/web/src/data/alumni.ts.';
    displayName: 'Alumnus';
    pluralName: 'alumni';
    singularName: 'alumnus';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::alumnus.alumnus'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    placed: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    poster: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    study: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    video: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface ApiAssessmentPageAssessmentPage
  extends Struct.SingleTypeSchema {
  collectionName: 'assessment_pages';
  info: {
    description: 'The Assessment System page (/academics/assessment/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. These pages carry no photographs; what differs between bands is how the page draws them, and the page owns that. Bands cannot be reordered, added or removed.';
    displayName: 'Assessment System';
    pluralName: 'assessment-pages';
    singularName: 'assessment-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    close: Schema.Attribute.Component<'structure.section', false>;
    conv: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cycle: Schema.Attribute.Component<'structure.section', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::assessment-page.assessment-page'
    > &
      Schema.Attribute.Private;
    next: Schema.Attribute.Component<'structure.section', false>;
    open: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    struct: Schema.Attribute.Component<'structure.section', false>;
    sup: Schema.Attribute.Component<'structure.section', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiBusRouteBusRoute extends Struct.CollectionTypeSchema {
  collectionName: 'bus_routes';
  info: {
    description: 'One published route run. Mirrors the `routes` export of apps/web/src/data/transport.ts. NOTE: the bus / run / stop COUNTS on the transport page are derived from these rows and are never stored \u2014 adding a route updates them.';
    displayName: 'Bus Route';
    pluralName: 'bus-routes';
    singularName: 'bus-route';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bus: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    driver: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    leg: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::bus-route.bus-route'
    > &
      Schema.Attribute.Private;
    phone: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 24;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'bus'> & Schema.Attribute.Required;
    staffOnly: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    stops: Schema.Attribute.Component<'shared.fact', true>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    vehicle: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

export interface ApiCalendarDocumentCalendarDocument
  extends Struct.CollectionTypeSchema {
  collectionName: 'calendar_documents';
  info: {
    description: 'A published academic calendar or planner. Mirrors the `calendars` export of apps/web/src/data/academicCalendar.ts. Some years the school publishes a PDF, some years only scanned sheets \u2014 `kind` records which, and the two are rendered differently.';
    displayName: 'Calendar Document';
    pluralName: 'calendar-documents';
    singularName: 'calendar-document';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    current: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    document: Schema.Attribute.Media<'files'>;
    extent: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 64;
      }>;
    href: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    kind: Schema.Attribute.Enumeration<['PDF', 'Sheets']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'PDF'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::calendar-document.calendar-document'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sheets: Schema.Attribute.Component<'shared.photo', true>;
    size: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
    slug: Schema.Attribute.UID<'year'> & Schema.Attribute.Required;
    type: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    year: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
  };
}

export interface ApiCampusFacilityCampusFacility
  extends Struct.CollectionTypeSchema {
  collectionName: 'campus_facilities';
  info: {
    description: 'A named room or space on the campus tour, with its photographs. Mirrors the `facilities` export of apps/web/src/data/campusTour.ts. `pending` marks one the school has named but not photographed \u2014 the tour shows it as awaited rather than inventing a picture.';
    displayName: 'Campus Facility';
    pluralName: 'campus-facilities';
    singularName: 'campus-facility';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    blurb: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    brief: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    gallery: Schema.Attribute.Component<'shared.photo', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::campus-facility.campus-facility'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    pending: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCampusSafetyPageCampusSafetyPage
  extends Struct.SingleTypeSchema {
  collectionName: 'campus_safety_page';
  info: {
    description: "Safety bands, the security plan's markers, and the emergency procedure. Mirrors apps/web/src/data/campus.ts. \u26A0 THE FIVE BAND HEADS \u2014 timeline, plan, transport, wellbeing, surveillance \u2014 are the eyebrow, heading and standfirst of each band on /campus/safety-security/, in page order. kicker = the eyebrow; the FIRST paragraph of body = the standfirst. \u26A0 NOT EDITABLE HERE, on purpose: the section-rail labels and anchors (tied to DOM ids), the plan's zoom buttons and its 'Select a point on the plan.' empty state \u2014 interface, not content. \u26A0 `transportFigures` ARE THE THREE COUNTS under the transport band \u2014 fleet size, routes, and the tracked proportion. They are TYPED, not computed: the fleet figure (29+) is larger than the number of distinct vehicles on the published routes (22), so deriving them from Bus Route would silently republish a different number. If the fleet changes, edit it here AND check the band's standfirst, which states the route count in words.";
    displayName: 'Campus Safety Page';
    pluralName: 'campus-safety-pages';
    singularName: 'campus-safety-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    emergencyPoints: Schema.Attribute.Component<'shared.measure', true>;
    emergencySteps: Schema.Attribute.Component<'shared.point', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::campus-safety-page.campus-safety-page'
    > &
      Schema.Attribute.Private;
    mapPoints: Schema.Attribute.Component<'campus.map-point', true>;
    plan: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    safetyGroups: Schema.Attribute.Component<'campus.safety-group', true>;
    surveillance: Schema.Attribute.Component<'structure.section', false>;
    surveillanceCards: Schema.Attribute.Component<'shared.point', true>;
    timeline: Schema.Attribute.Component<'structure.section', false>;
    transport: Schema.Attribute.Component<'structure.section', false>;
    transportFeatures: Schema.Attribute.Component<'shared.measure', true>;
    transportFigures: Schema.Attribute.Component<'shared.figure', true>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wellbeing: Schema.Attribute.Component<'structure.section', false>;
    wellbeingCards: Schema.Attribute.Component<'shared.point', true>;
  };
}

export interface ApiCampusTourPageCampusTourPage
  extends Struct.SingleTypeSchema {
  collectionName: 'campus_tour_page';
  info: {
    description: "Every word of /campus/ that is not a facility. The facilities themselves are the Campus Facility collection beside this; the band headings, the six featured rooms and the visit call-to-action are here. \u26A0 FIELD NAMES MATCH THE BANDS ON THE PAGE, in page order: overview, categories, gallery, featured, journey, visit. \u26A0 WHAT IS DELIBERATELY NOT HERE: the section-rail labels and anchors (they are tied to DOM ids \u2014 an edit would break the in-page links), the gallery's own heading (it counts the photographs and must stay derived), and interface labels such as All / Load more / Close (chrome, not content).";
    displayName: 'Campus Tour Page';
    pluralName: 'campus-tour-pages';
    singularName: 'campus-tour-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    categories: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    featured: Schema.Attribute.Component<'shared.point', true>;
    featuredHead: Schema.Attribute.Component<'structure.section', false>;
    gallery: Schema.Attribute.Component<'structure.section', false>;
    journey: Schema.Attribute.Component<'shared.point', true>;
    journeyHead: Schema.Attribute.Component<'structure.section', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::campus-tour-page.campus-tour-page'
    > &
      Schema.Attribute.Private;
    overview: Schema.Attribute.Component<'structure.section', false>;
    overviewStats: Schema.Attribute.Component<'shared.stat', true>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    visit: Schema.Attribute.Component<'structure.section', false>;
    visitCallLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    visitCtaHref: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    visitCtaLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface ApiCareerPageCareerPage extends Struct.SingleTypeSchema {
  collectionName: 'career_page';
  info: {
    description: "Every word of /career/ that is not a job notice. The notices themselves are the Job Posting collection beside this. \u26A0 `wall` AND `apply` ARE BAND HEADS \u2014 kicker = the eyebrow, the FIRST paragraph of body = the line under the heading. \u26A0\u26A0 THE POSTING COUNT ABOVE THE WALL IS NOT HERE AND MUST NOT BE. It is rendered from the number of published Job Postings, so it can never drift from the wall below it the way a typed number would. \u26A0 `applyMethods` USE shared.measure \u2014 `label` is the row's term (\"By email\") and `body` the note under it. shared.detail was the obvious choice and is wrong: its `value` is REQUIRED, and there is no value to put there. The address, the recruitment email and the office number under each one come from Site Settings \u2014 one contact detail, edited in one place, printed in 57 files. \u26A0 NOT EDITABLE HERE: each notice's tag and date (they belong to the Job Posting) and the image viewer's 'Close the viewer' control.";
    displayName: 'Career Page';
    pluralName: 'career-pages';
    singularName: 'career-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    apply: Schema.Attribute.Component<'structure.section', false>;
    applyMethods: Schema.Attribute.Component<'shared.measure', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ctaCallLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    ctaCvLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::career-page.career-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wall: Schema.Attribute.Component<'structure.section', false>;
  };
}

export interface ApiClassCornerDocumentClassCornerDocument
  extends Struct.CollectionTypeSchema {
  collectionName: 'class_corner_documents';
  info: {
    description: "ONE CARD on /academics/class-corner/. \u26A0\u26A0 THE DOCUMENTS ARE HELD HERE NOW, NOT LINKED FROM THE SCHOOL'S OLD SITE. They used to point at sunbeamballia.edu.in/wp-content/uploads/\u2026, which meant a parent left this site to read them and the school had to maintain two places. Upload the new file over `file` and the card serves it \u2014 no developer, no deploy. \u26A0 THE TRADE THAT COMES WITH THAT: a linked file was always whatever the school had just published; a held file is whatever was last uploaded HERE. If the office revises a timetable or a monitors list, it has to be uploaded here too, or this page quietly serves last session's.";
    displayName: 'Class Corner Document';
    pluralName: 'class-corner-documents';
    singularName: 'class-corner-document';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    file: Schema.Attribute.Media<'images' | 'files'>;
    icon: Schema.Attribute.Enumeration<
      ['teacher', 'clock', 'badge', 'exam', 'person', 'star']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'badge'>;
    link: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::class-corner-document.class-corner-document'
    > &
      Schema.Attribute.Private;
    needs: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    order: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    pending: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiClassTimetableClassTimetable
  extends Struct.CollectionTypeSchema {
  collectionName: 'class_timetables';
  info: {
    description: "ONE ENTRY PER CLASS on /academics/class-corner/class-timetable/, each holding that class's section sheets. \u26A0\u26A0 A COLLECTION, NOT ONE BIG SINGLE TYPE, SO THE SCHOOL CAN UPDATE ONE CLASS WITHOUT OPENING THE OTHER FOURTEEN \u2014 replacing Class VI's sheets at the start of a term should not put Class XII's at risk in the same save. \u26A0 `stage` IS WHAT GROUPS THE PAGE. A class with a stage the page does not know about simply will not appear, so the five values are fixed here rather than free text.";
    displayName: 'Class Timetable';
    pluralName: 'class-timetables';
    singularName: 'class-timetable';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::class-timetable.class-timetable'
    > &
      Schema.Attribute.Private;
    order: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    publishedAt: Schema.Attribute.DateTime;
    sheets: Schema.Attribute.Component<'timetable.sheet', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    slug: Schema.Attribute.UID<'label'> & Schema.Attribute.Required;
    stage: Schema.Attribute.Enumeration<
      ['pre-primary', 'primary', 'middle', 'secondary', 'senior']
    > &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCompetitiveExamPageCompetitiveExamPage
  extends Struct.SingleTypeSchema {
  collectionName: 'competitive_exam_pages';
  info: {
    description: 'The Competitive Exam Preparation page (/academics/assessment/competitive-exam-preparation/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. These pages carry no photographs; what differs between bands is how the page draws them, and the page owns that. Bands cannot be reordered, added or removed.';
    displayName: 'Competitive Exam Preparation';
    pluralName: 'competitive-exam-pages';
    singularName: 'competitive-exam-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    close: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    feat: Schema.Attribute.Component<'structure.section', false>;
    gal: Schema.Attribute.Component<'structure.section', false>;
    list: Schema.Attribute.Component<'structure.section', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::competitive-exam-page.competitive-exam-page'
    > &
      Schema.Attribute.Private;
    open: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiContactEnquiryContactEnquiry
  extends Struct.CollectionTypeSchema {
  collectionName: 'contact_enquiries';
  info: {
    description: "A message sent through the form on /contact-us/. WRITTEN BY VISITORS, NOT BY EDITORS \u2014 nothing here is authored in the admin panel, and no page on the site reads it back. Fields mirror the form's own inputs one-for-one; see apps/web/src/pages/contact-us.astro. `message` IS THE POINT OF THE FORM and is required at every layer \u2014 the textarea, the controller whitelist and this schema. It was added late: the textarea shipped first and for a while enquiries reached the office with every field EXCEPT what the parent had written. If any one of those three layers drops it again, that happens again and nothing says so. draftAndPublish is OFF because an enquiry is a record of something that happened, not a document with a draft state.";
    displayName: 'Contact Enquiry';
    pluralName: 'contact-enquiries';
    singularName: 'contact-enquiry';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    city: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    consent: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-enquiry.contact-enquiry'
    > &
      Schema.Attribute.Private;
    message: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 4000;
      }>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    officeNotes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 5000;
      }>;
    phone: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    sourcePage: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    status: Schema.Attribute.Enumeration<['new', 'read', 'replied', 'closed']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'new'>;
    studentClass: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiContactPageContactPage extends Struct.SingleTypeSchema {
  collectionName: 'contact_page';
  info: {
    description: "The editable copy of /contact-us/. \u26A0 THE ADDRESS, EMAIL, PHONES AND SOCIAL LINKS ARE NOT HERE. They are Site Settings' and are rendered in 57 files from that one record; duplicating them onto this page would give the school two places to correct and one of them would be missed. \u26A0 THE MAP EMBED AND THE FORM HANDLER STAY IN CODE. The map URL is built from the school's own name and address, so it follows Site Settings automatically; the handler's validation, submission and field bindings are integration. \u26A0 WHAT MOVED OUT OF THE <script> IS THE WORDING: every error and status message a parent reads was a string literal in the page's JavaScript, unreachable to anyone but a developer.";
    displayName: 'Contact Page';
    pluralName: 'contact-pages';
    singularName: 'contact-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    addressHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    classLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    classOptions: Schema.Attribute.Component<'shared.fact', true>;
    classPlaceholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    consentError: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    consentLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    contactHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    fields: Schema.Attribute.Component<'contact.field', true>;
    heading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-page.contact-page'
    > &
      Schema.Attribute.Private;
    locationHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    sendingLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    socialHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    standfirst: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    statusFailure: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    statusNotConnected: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    statusSuccess: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    submitLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCredentialCredential extends Struct.CollectionTypeSchema {
  collectionName: 'credentials';
  info: {
    description: 'Third-party recognition \u2014 rankings, certifications and awards. Mirrors the `credentials` export of apps/web/src/data/achievements.ts.';
    displayName: 'Credential';
    pluralName: 'credentials';
    singularName: 'credential';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    figure: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    icon: Schema.Attribute.Enumeration<
      [
        'trophy',
        'medal',
        'target',
        'sprout',
        'field',
        'whistle',
        'belt',
        'chess',
        'carrom',
        'yoga',
        'swing',
        'skating',
        'aerobics',
        'karate',
        'kabaddi',
        'khokho',
        'cricket',
        'football',
        'basketball',
        'volleyball',
        'hockey',
        'tabletennis',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'medal'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::credential.credential'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCriticalThinkingPageCriticalThinkingPage
  extends Struct.SingleTypeSchema {
  collectionName: 'critical_thinking_pages';
  info: {
    description: 'The Critical Thinking & Creativity page \u2014 one named field per visual section, in the order a reader meets them. \u26A0 Sections cannot be reordered, added or removed: the page is designed around these four and each is drawn differently.';
    displayName: 'Critical Thinking & Creativity';
    pluralName: 'critical-thinking-pages';
    singularName: 'critical-thinking-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::critical-thinking-page.critical-thinking-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sectionFour: Schema.Attribute.Component<'philosophy.collage', false>;
    sectionOne: Schema.Attribute.Component<'philosophy.statement', false>;
    sectionThree: Schema.Attribute.Component<'philosophy.marked-list', false>;
    sectionTwo: Schema.Attribute.Component<'philosophy.marked-list', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCurriculumPageCurriculumPage
  extends Struct.SingleTypeSchema {
  collectionName: 'curriculum_pages';
  info: {
    description: 'The Curriculum page \u2014 one named field per visual section, in the order a reader meets them. \u26A0 THE STAGES ARE EDITED ONCE, AT THE TOP, and drawn twice: as the journey in 01 and as the rows of the library in 02. Sections cannot be reordered, added or removed.';
    displayName: 'Curriculum';
    pluralName: 'curriculum-pages';
    singularName: 'curriculum-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::curriculum-page.curriculum-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sectionFive: Schema.Attribute.Component<'academics.tiles', false>;
    sectionFour: Schema.Attribute.Component<'academics.tiles', false>;
    sectionOne: Schema.Attribute.Component<'academics.lede', false>;
    sectionThree: Schema.Attribute.Component<'academics.tiles', false>;
    sectionTwo: Schema.Attribute.Component<'academics.lede', false>;
    stages: Schema.Attribute.Component<'academics.stage', true>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiDisclosurePageDisclosurePage
  extends Struct.SingleTypeSchema {
  collectionName: 'disclosure_page';
  info: {
    description: "The CBSE Mandatory Public Disclosure at /general-info/. Replaces apps/web/src/data/disclosure.ts. \u26A0 THIS IS A REGULATORY FILING, NOT MARKETING COPY. Every figure here is transcribed from the school's own documents and must continue to agree with the PDFs linked beside it \u2014 a value corrected here and not in the filing makes the page disagree with the document of record. \u26A0 REFILED ANNUALLY: the board results, staff summary, teacher list, infrastructure figures and all thirteen certificates change each session, which is why they are editable rather than compiled in. \u26A0 THE 131 TEACHERS ARE A SEPARATE COLLECTION (Teacher), not a component here \u2014 a 131-entry repeatable field is unusable in the admin, and the collection gives a searchable, filterable list. The designation filter on the page is DERIVED from it and is never a typed list.";
    displayName: 'Disclosure Page';
    pluralName: 'disclosure-pages';
    singularName: 'disclosure-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    academicDocs: Schema.Attribute.Component<'shared.document', true>;
    boardResults: Schema.Attribute.Component<'disclosure.board-result', true>;
    boardResultsNote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    calloutBody: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    calloutHeading: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    calloutPhoto: Schema.Attribute.Component<'shared.photo', false>;
    certificates: Schema.Attribute.Component<'shared.document', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    docViewLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    generalInformation: Schema.Attribute.Component<'shared.detail', true>;
    infrastructure: Schema.Attribute.Component<'shared.detail', true>;
    inspectionVideo: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::disclosure-page.disclosure-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    quickInfo: Schema.Attribute.Component<'shared.detail', true>;
    quickNote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    railLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    railPdfBody: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    railPdfDownloadLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    railPdfTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    railPdfViewLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    sections: Schema.Attribute.Component<'disclosure.section', true>;
    sourceCovers: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    sourcePage: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    sourcePdfFile: Schema.Attribute.Media<'files' | 'images'>;
    sourcePdfHref: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    staffHeadlineCount: Schema.Attribute.Integer;
    staffLead: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    staffSummary: Schema.Attribute.Component<'shared.detail', true>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiExcursionSectionExcursionSection
  extends Struct.CollectionTypeSchema {
  collectionName: 'excursion_sections';
  info: {
    description: "One excursion as the school published it. Mirrors the `sections` export of apps/web/src/data/excursions.ts \u2014 body is VERBATIM per that file's header, so it is a paragraph list rather than rich text.";
    displayName: 'Excursion Section';
    pluralName: 'excursion-sections';
    singularName: 'excursion-section';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    art: Schema.Attribute.Media<'images'>;
    body: Schema.Attribute.Component<'shared.paragraph', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    lang: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 16;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::excursion-section.excursion-section'
    > &
      Schema.Attribute.Private;
    needs: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    place: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    shots: Schema.Attribute.Component<'shared.photo', true>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    who: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    year: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
  };
}

export interface ApiExpeditionExpedition extends Struct.CollectionTypeSchema {
  collectionName: 'expeditions';
  info: {
    description: 'A short learning-expedition entry. Mirrors the `expeditions` export of apps/web/src/data/excursions.ts.';
    displayName: 'Expedition';
    pluralName: 'expeditions';
    singularName: 'expedition';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    kind: Schema.Attribute.Enumeration<
      ['civic', 'nature', 'heritage', 'industry']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'civic'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::expedition.expedition'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    note: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiExperientialInquiryPageExperientialInquiryPage
  extends Struct.SingleTypeSchema {
  collectionName: 'experiential_inquiry_pages';
  info: {
    description: 'The Experiential & Inquiry-Based Learning page \u2014 one named field per visual section, in the order a reader meets them. \u26A0 Sections cannot be reordered, added or removed: the page is designed around these four and each is drawn differently.';
    displayName: 'Experiential & Inquiry Learning';
    pluralName: 'experiential-inquiry-pages';
    singularName: 'experiential-inquiry-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    close: Schema.Attribute.Component<'philosophy.close', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::experiential-inquiry-page.experiential-inquiry-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sectionOne: Schema.Attribute.Component<'philosophy.pair', false>;
    sectionThree: Schema.Attribute.Component<'philosophy.listing', false>;
    sectionTwo: Schema.Attribute.Component<'philosophy.steps', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiExperientialLearningPageExperientialLearningPage
  extends Struct.SingleTypeSchema {
  collectionName: 'experiential_learning_pages';
  info: {
    description: 'The Experiential Learning page (/academics/teaching-learning/experiential-learning/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. What differs is how the page lays that out, and the page owns it. Bands cannot be reordered, added or removed.';
    displayName: 'Experiential Learning';
    pluralName: 'experiential-learning-pages';
    singularName: 'experiential-learning-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    close: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::experiential-learning-page.experiential-learning-page'
    > &
      Schema.Attribute.Private;
    open: Schema.Attribute.Component<'structure.section', false>;
    path: Schema.Attribute.Component<'structure.section', false>;
    proj: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiFacilitiesPageFacilitiesPage
  extends Struct.SingleTypeSchema {
  collectionName: 'facilities_page';
  info: {
    description: 'The infrastructure page. Mirrors apps/web/src/data/facilities.ts \u2014 KPIs, grouped inventory, rationale cards and the growth progression. \u26A0 `figures` IS THE HEAD OF THE KPI BAND on /campus/facilities-infrastructure/ \u2014 kicker = eyebrow, first body paragraph = standfirst. The other two bands on that page (the photo wall and the visit call-to-action) are SHARED WITH /campus/ and are edited in Campus Tour Page, not here.';
    displayName: 'Facilities Page';
    pluralName: 'facilities-pages';
    singularName: 'facilities-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    figures: Schema.Attribute.Component<'structure.section', false>;
    groups: Schema.Attribute.Component<'campus.facility-group', true>;
    kpis: Schema.Attribute.Component<'shared.stat', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::facilities-page.facilities-page'
    > &
      Schema.Attribute.Private;
    progression: Schema.Attribute.Component<'shared.point', true>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    whyCards: Schema.Attribute.Component<'shared.point', true>;
  };
}

export interface ApiGameGame extends Struct.CollectionTypeSchema {
  collectionName: 'games';
  info: {
    description: 'One sport on the roster. Mirrors `games.outdoor` / `games.indoor` in apps/web/src/data/sports.ts \u2014 ONE type with an `arena` enum rather than two, because the card is identical and only the rail it sits in differs.';
    displayName: 'Game';
    pluralName: 'games';
    singularName: 'game';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    arena: Schema.Attribute.Enumeration<['outdoor', 'indoor']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'outdoor'>;
    blurb: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    icon: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::game.game'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    photo: Schema.Attribute.Media<'images'>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    venue: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface ApiHistoryPageHistoryPage extends Struct.SingleTypeSchema {
  collectionName: 'history_page';
  info: {
    description: 'The legacy narrative and its surrounding bands. `history` is prose, not a dated milestone list \u2014 the school publishes paragraphs rather than a timeline, and inventing dates for it was ruled out. WARNING: facts and onward are held but NOT RENDERED \u2014 both were declared in history-legacy.astro and never used by its template. They are carried here so the copy is not lost; putting them on the page would be a redesign, which this migration does not do.';
    displayName: 'History Page';
    pluralName: 'history-pages';
    singularName: 'history-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    facts: Schema.Attribute.Component<'shared.point', true>;
    history: Schema.Attribute.Component<'shared.paragraph', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::history-page.history-page'
    > &
      Schema.Attribute.Private;
    onward: Schema.Attribute.Component<'shared.link', true>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    voices: Schema.Attribute.Component<'about.testimonial', true>;
  };
}

export interface ApiHomepageHomepage extends Struct.SingleTypeSchema {
  collectionName: 'homepage';
  info: {
    description: 'Every editorial section of /. Replaces apps/web/src/data/home.ts, `heritageLede` from site.ts, and the inline arrays that were in Achievements.astro and EventsNews.astro. \u26A0 NOT HERE, BY DESIGN: the notice board, alumni cards and quick-access tiles (relations to Notice, Alumnus and Site Settings, which own them) and `voices.slots` (a layout number that stays in code).';
    displayName: 'Homepage';
    pluralName: 'homepages';
    singularName: 'homepage';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    achievementsHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    achievementsHonoursHead: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    achievementsInstitutional: Schema.Attribute.Component<'shared.point', true>;
    achievementsLead: Schema.Attribute.Component<'shared.figure', false>;
    achievementsLeadCta: Schema.Attribute.Component<'shared.link', false>;
    achievementsPhotos: Schema.Attribute.Component<'shared.photo', true>;
    achievementsPill: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    achievementsStudent: Schema.Attribute.Component<'shared.figure', true>;
    achievementsSub: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    affiliations: Schema.Attribute.Component<'home.affiliation-mark', true>;
    affiliationsHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    beyondDeck: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    beyondEyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    beyondHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    beyondLinks: Schema.Attribute.Component<'shared.link', true>;
    beyondSport: Schema.Attribute.Component<'home.sport-card', false>;
    beyondStrands: Schema.Attribute.Component<'home.strand', true>;
    campusEyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    campusHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    campusSub: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    events: Schema.Attribute.Component<'home.event', true>;
    eventsHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    eventsPill: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    eventsSub: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    facilities: Schema.Attribute.Component<'home.facility-card', true>;
    heritageBody: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    heritageEyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    heritageFigure: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 24;
      }>;
    heritageHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    heroActions: Schema.Attribute.Component<'shared.link', true>;
    heroDeck: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    heroEyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    heroSlides: Schema.Attribute.Component<'home.slide', true>;
    heroStats: Schema.Attribute.Component<'shared.figure', true>;
    heroTitle: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    learningEvidence: Schema.Attribute.Component<'shared.point', true>;
    learningEyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    learningHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    learningImageBrief: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    learningLink: Schema.Attribute.Component<'shared.link', false>;
    learningParagraphs: Schema.Attribute.Component<'shared.paragraph', true>;
    learningPhoto: Schema.Attribute.Component<'shared.photo', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::homepage.homepage'
    > &
      Schema.Attribute.Private;
    principalCta: Schema.Attribute.Component<'shared.link', false>;
    publishedAt: Schema.Attribute.DateTime;
    stages: Schema.Attribute.Component<'home.stage', true>;
    stagesHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    stagesPill: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    stagesTagline: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    storyBentoLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    storyChecks: Schema.Attribute.Component<'shared.fact', true>;
    storyCta: Schema.Attribute.Component<'shared.link', false>;
    storyEyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    storyHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    storyLinks: Schema.Attribute.Component<'shared.link', true>;
    storyParagraphs: Schema.Attribute.Component<'shared.paragraph', true>;
    storyPhotos: Schema.Attribute.Component<'shared.photo', true>;
    storyQuote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    storyQuoteAttribution: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    storyStat: Schema.Attribute.Component<'shared.figure', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    voicesDeck: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    voicesEyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    voicesHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    voicesItems: Schema.Attribute.Component<'home.voice', true>;
    voicesPending: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
  };
}

export interface ApiHomeworkPolicyPageHomeworkPolicyPage
  extends Struct.SingleTypeSchema {
  collectionName: 'homework_policy_pages';
  info: {
    description: 'The Homework Policy page (/academics/assessment/homework-policy/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. These pages carry no photographs; what differs between bands is how the page draws them, and the page owns that. Bands cannot be reordered, added or removed.';
    displayName: 'Homework Policy';
    pluralName: 'homework-policy-pages';
    singularName: 'homework-policy-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ask: Schema.Attribute.Component<'structure.section', false>;
    clear: Schema.Attribute.Component<'structure.section', false>;
    close: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    frame: Schema.Attribute.Component<'structure.section', false>;
    gap: Schema.Attribute.Component<'structure.section', false>;
    item: Schema.Attribute.Component<'structure.section', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::homework-policy-page.homework-policy-page'
    > &
      Schema.Attribute.Private;
    open: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiJobPostingJobPosting extends Struct.CollectionTypeSchema {
  collectionName: 'job_postings';
  info: {
    description: 'A recruitment poster. Mirrors the `posters` export of apps/web/src/data/career.ts. The school publishes vacancies as designed posters, never as structured text, so the poster IS the posting and the long alt text is the only machine-readable form of it.';
    displayName: 'Job Posting';
    pluralName: 'job-postings';
    singularName: 'job-posting';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 4000;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dated: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    lang: Schema.Attribute.Enumeration<['en', 'hi']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'en'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::job-posting.job-posting'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    tag: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiLaboratoriesClubsPageLaboratoriesClubsPage
  extends Struct.SingleTypeSchema {
  collectionName: 'laboratories_clubs_pages';
  info: {
    description: 'The Laboratories & Clubs page (/academics/teaching-learning/laboratories-clubs/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. What differs is how the page lays that out, and the page owns it. Bands cannot be reordered, added or removed.';
    displayName: 'Laboratories & Clubs';
    pluralName: 'laboratories-clubs-pages';
    singularName: 'laboratories-clubs-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    close: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    interlude: Schema.Attribute.Component<'structure.section', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::laboratories-clubs-page.laboratories-clubs-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    rooms: Schema.Attribute.Component<'structure.section', false>;
    spaces: Schema.Attribute.Component<'structure.section', false>;
    twelve: Schema.Attribute.Component<'structure.section', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiLeaderMessageLeaderMessage
  extends Struct.CollectionTypeSchema {
  collectionName: 'leader_messages';
  info: {
    description: 'A signed message from a member of the school\u2019s leadership. \u26A0\u26A0 `paragraphs` IS THE HOMEPAGE EXTRACT; `fullMessage` IS THE WHOLE THING. The homepage panel is designed around the pull quote and two paragraphs; the dedicated /about/ page runs the full message. Where `fullMessage` is set, the dedicated page uses it and drops the pull quote \u2014 the quoted sentence is inside the full text and would otherwise be read twice in a row. \u26A0 EVERY EXTRACT PARAGRAPH MUST APPEAR VERBATIM IN `fullMessage`. The page checks this at build time and fails if the two ever drift, so the extract can never quietly say something the message does not.';
    displayName: 'Leader Message';
    pluralName: 'leader-messages';
    singularName: 'leader-message';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    credentials: Schema.Attribute.Component<'shared.fact', true>;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    fullMessage: Schema.Attribute.Component<'shared.paragraph', true>;
    heading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::leader-message.leader-message'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    paragraphs: Schema.Attribute.Component<'shared.paragraph', true>;
    pending: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    portrait: Schema.Attribute.Media<'images'>;
    portraitAlt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    portraitBrief: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    pullQuote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    role: Schema.Attribute.Enumeration<
      ['director', 'principal', 'vice-principal']
    > &
      Schema.Attribute.Required;
    roleLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMentoringPageMentoringPage extends Struct.SingleTypeSchema {
  collectionName: 'mentoring_pages';
  info: {
    description: 'The Mentoring page (/academics/assessment/mentoring/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. These pages carry no photographs; what differs between bands is how the page draws them, and the page owns that. Bands cannot be reordered, added or removed.';
    displayName: 'Mentoring';
    pluralName: 'mentoring-pages';
    singularName: 'mentoring-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    final: Schema.Attribute.Component<'structure.section', false>;
    human: Schema.Attribute.Component<'structure.section', false>;
    jrn: Schema.Attribute.Component<'structure.section', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::mentoring-page.mentoring-page'
    > &
      Schema.Attribute.Private;
    open: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    rel: Schema.Attribute.Component<'structure.section', false>;
    roles: Schema.Attribute.Component<'structure.section', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMethodologyPageMethodologyPage
  extends Struct.SingleTypeSchema {
  collectionName: 'methodology_pages';
  info: {
    description: 'The Methodology page (/academics/teaching-learning/methodology/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. What differs is how the page lays that out, and the page owns it. Bands cannot be reordered, added or removed.';
    displayName: 'Methodology';
    pluralName: 'methodology-pages';
    singularName: 'methodology-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    close: Schema.Attribute.Component<'structure.section', false>;
    collab: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::methodology-page.methodology-page'
    > &
      Schema.Attribute.Private;
    open: Schema.Attribute.Component<'structure.section', false>;
    plat: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    three: Schema.Attribute.Component<'structure.section', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMiddleSchoolPageMiddleSchoolPage
  extends Struct.SingleTypeSchema {
  collectionName: 'middle_school_pages';
  info: {
    description: 'The Middle School page (/academics/structure/middle-school/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. What differs between them is how the page lays that out, and the page owns that. Bands cannot be reordered, added or removed.';
    displayName: 'Middle School';
    pluralName: 'middle-school-pages';
    singularName: 'middle-school-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ach: Schema.Attribute.Component<'structure.section', false>;
    close: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    doing: Schema.Attribute.Component<'structure.section', false>;
    exp: Schema.Attribute.Component<'structure.section', false>;
    four: Schema.Attribute.Component<'structure.section', false>;
    jrn: Schema.Attribute.Component<'structure.section', false>;
    lab: Schema.Attribute.Component<'structure.section', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::middle-school-page.middle-school-page'
    > &
      Schema.Attribute.Private;
    open: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    subj: Schema.Attribute.Component<'structure.section', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNewsCategoryPageNewsCategoryPage
  extends Struct.CollectionTypeSchema {
  collectionName: 'news_category_pages';
  info: {
    description: 'The header and group definitions for one chronicle index \u2014 /news-events/<slug>/. Five records: workshops, competitions, celebrations, school-events and achievements. The achievements record carries only its header; its items come from Major Achievement.';
    displayName: 'News Category Page';
    pluralName: 'news-category-pages';
    singularName: 'news-category-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    groups: Schema.Attribute.Component<'news.group', true>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::news-category-page.news-category-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    stand: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    standfirst: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNewsItemNewsItem extends Struct.CollectionTypeSchema {
  collectionName: 'news_items';
  info: {
    description: 'One workshop, competition, celebration or school event. Replaces the four ChroniclePage exports of apps/web/src/data/newsPages.ts \u2014 four near-identical index/detail pairs collapse into ONE type separated by `category`. NOTE: the achievements chronicle is NOT stored here; its items derive from Major Achievement, and duplicating them would give one fact two owners. School activities reuse this type as category `activity` \u2014 the same ChroniclePage shape, a different URL space.';
    displayName: 'News Item';
    pluralName: 'news-items';
    singularName: 'news-item';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    art: Schema.Attribute.Media<'images'>;
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 4000;
      }>;
    category: Schema.Attribute.Enumeration<
      ['workshop', 'competition', 'celebration', 'school-event', 'activity']
    > &
      Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    fit: Schema.Attribute.Enumeration<['cover', 'contain']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'cover'>;
    gallery: Schema.Attribute.Component<'shared.photo', true>;
    group: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    href: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::news-item.news-item'
    > &
      Schema.Attribute.Private;
    meta: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    result: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    when: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface ApiNoticeNotice extends Struct.CollectionTypeSchema {
  collectionName: 'notices';
  info: {
    description: "A notice poster published by the school. Fields mirror apps/web/src/data/notices.ts exactly \u2014 see that file's header for why these fields and no others (no category, no description, no PDF: the source provides none).";
    displayName: 'Notice';
    pluralName: 'notices';
    singularName: 'notice';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.Date;
    dateLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    featured: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::notice.notice'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    sub: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPageMetaPageMeta extends Struct.CollectionTypeSchema {
  collectionName: 'page_metas';
  info: {
    description: "Route-level metadata and hero content for an EXISTING page. One row per route already in the site. \u26A0 THIS IS NOT A PAGE BUILDER: it carries no body content, no sections and no dynamic zone. A route's actual content lives in its own content type; this holds only what the <head> and the banner need.";
    displayName: 'Page Meta';
    pluralName: 'page-metas';
    singularName: 'page-meta';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    crumbs: Schema.Attribute.Component<'shared.link', true>;
    heroAlt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    heroBanner: Schema.Attribute.Media<'images'>;
    heroPosition: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }> &
      Schema.Attribute.DefaultTo<'50% 45%'>;
    heroStandfirst: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    heroTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::page-meta.page-meta'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    route: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.Required;
    titleStandalone: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiParentFeedbackParentFeedback
  extends Struct.CollectionTypeSchema {
  collectionName: 'parent_feedbacks';
  info: {
    description: "Feedback sent through the 'Your Voice Matters' form on /parents-feedback/. WRITTEN BY PARENTS, NOT BY EDITORS. \u26A0\u26A0 NOTHING HERE IS EVER PUBLISHED TO THE SITE. The voices carousel on that page is fed by data/parentsFeedback.ts, which a human fills in after checking the feedback and obtaining written consent \u2014 no page reads this collection. Treat every row as private correspondence about a named child. draftAndPublish is OFF because a submission is a record of something that happened, not a document with a draft state.";
    displayName: 'Parent Feedback';
    pluralName: 'parent-feedbacks';
    singularName: 'parent-feedback';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    appreciate: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    feedback: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 5000;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::parent-feedback.parent-feedback'
    > &
      Schema.Attribute.Private;
    officeNotes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 5000;
      }>;
    parentName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    phone: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
    recommend: Schema.Attribute.Enumeration<['Yes', 'Maybe', 'No']>;
    sourcePage: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    status: Schema.Attribute.Enumeration<['new', 'read', 'replied', 'closed']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'new'>;
    studentClass: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    studentName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiParentTeacherPageParentTeacherPage
  extends Struct.SingleTypeSchema {
  collectionName: 'parent_teacher_pages';
  info: {
    description: 'The Parent\u2013Teacher Meetings page (/academics/assessment/parent-teacher-meetings/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. These pages carry no photographs; what differs between bands is how the page draws them, and the page owns that. Bands cannot be reordered, added or removed.';
    displayName: 'Parent\u2013Teacher Meetings';
    pluralName: 'parent-teacher-pages';
    singularName: 'parent-teacher-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    agenda: Schema.Attribute.Component<'structure.section', false>;
    close: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::parent-teacher-page.parent-teacher-page'
    > &
      Schema.Attribute.Private;
    open: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    why: Schema.Attribute.Component<'structure.section', false>;
  };
}

export interface ApiParentTestimonialParentTestimonial
  extends Struct.CollectionTypeSchema {
  collectionName: 'parent_testimonials';
  info: {
    description: "A parent quote CLEARED FOR PUBLICATION, shown in the voices carousel on /parents-feedback/. \u26A0\u26A0 THIS IS NOT THE FEEDBACK INBOX. Parent Feedback holds what parents SENT through the form \u2014 private correspondence about a named child, which no page reads. A row only reaches this collection after a person has spoken to the parent and obtained consent. \u26A0\u26A0 THERE IS NO FIELD FOR THE CHILD'S NAME, AND THAT IS THE SAFEGUARD. Not a rule someone has to remember \u2014 the column does not exist, so a child's name cannot reach the page even by mistake. A parent can consent for themselves; consenting to make their child's name searchable on a school's public site is a different question, and this collection does not ask it. \u26A0 CONSENT IS RECORDED, NOT ASSUMED. `consentOn` and `consentNote` exist so that months later anyone can see when it was given and how. A row without them should not be published.";
    displayName: 'Parent Testimonial';
    pluralName: 'parent-testimonials';
    singularName: 'parent-testimonial';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    className: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    consentNote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    consentOn: Schema.Attribute.Date & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::parent-testimonial.parent-testimonial'
    > &
      Schema.Attribute.Private;
    order: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    parentName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    quote: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    relation: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Parent'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPrePrimaryPagePrePrimaryPage
  extends Struct.SingleTypeSchema {
  collectionName: 'pre_primary_pages';
  info: {
    description: 'The Pre-Primary page (/academics/structure/pre-primary/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. What differs between them is how the page lays that out, and the page owns that. Bands cannot be reordered, added or removed. \u26A0 THE SIXTH BAND IS EDITED AS TWO: the three stops on the curve, and the summary strip under them. One <section> on the page, two things an editor thinks about separately.';
    displayName: 'Pre-Primary';
    pluralName: 'pre-primary-pages';
    singularName: 'pre-primary-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    abh: Schema.Attribute.Component<'structure.section', false>;
    close: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    doing: Schema.Attribute.Component<'structure.section', false>;
    first: Schema.Attribute.Component<'structure.section', false>;
    firstBand: Schema.Attribute.Component<'structure.section', false>;
    land: Schema.Attribute.Component<'structure.section', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::pre-primary-page.pre-primary-page'
    > &
      Schema.Attribute.Private;
    open: Schema.Attribute.Component<'structure.section', false>;
    play: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPrimaryStagePagePrimaryStagePage
  extends Struct.SingleTypeSchema {
  collectionName: 'primary_stage_pages';
  info: {
    description: 'The Primary page (/academics/structure/primary/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. What differs between them is how the page lays that out, and the page owns that. Bands cannot be reordered, added or removed.';
    displayName: 'Primary';
    pluralName: 'primary-stage-pages';
    singularName: 'primary-stage-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    act: Schema.Attribute.Component<'structure.section', false>;
    appr: Schema.Attribute.Component<'structure.section', false>;
    close: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    jrn: Schema.Attribute.Component<'structure.section', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::primary-stage-page.primary-stage-page'
    > &
      Schema.Attribute.Private;
    open: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    rail: Schema.Attribute.Component<'structure.section', false>;
    space: Schema.Attribute.Component<'structure.section', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    val: Schema.Attribute.Component<'structure.section', false>;
  };
}

export interface ApiPublicationPublication extends Struct.CollectionTypeSchema {
  collectionName: 'publications';
  info: {
    description: "One downloadable publication on /publications/ \u2014 a club newsletter, a magazine edition or an e-newspaper issue. \u26A0\u26A0 THIS IS THE LIST THE SCHOOL ADDS TO. A new e-newspaper is one new row here; nothing else needs touching. \u26A0 `href` IS THE SCHOOL'S OWN URL \u2014 a PDF on its server or a Google Drive viewer link. Every one was transcribed from the school's live page, not composed. Do not invent a link to fill a gap: a row with no file is worse than no row. \u26A0 `group` DECIDES WHICH BAND IT APPEARS IN, and `displayOrder` its position within that band. The school's own order is preserved \u2014 it is NOT a ranking, so do not re-sort by date.";
    displayName: 'Publication';
    pluralName: 'publications';
    singularName: 'publication';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    file: Schema.Attribute.Media<'files' | 'images'>;
    group: Schema.Attribute.Enumeration<
      [
        'entrepreneurial-chronicles',
        'quiz-club',
        'moon-club',
        'heritage-club',
        'financial-literacy-club',
        'school-magazine',
        'e-newspaper',
      ]
    > &
      Schema.Attribute.Required;
    href: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::publication.publication'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPublicationsPagePublicationsPage
  extends Struct.SingleTypeSchema {
  collectionName: 'publications_page';
  info: {
    description: 'The headings on /publications/, and the MYRA STEM Lab newsletter pages. \u26A0 THE PUBLICATIONS THEMSELVES ARE NOT HERE \u2014 each newsletter, magazine and e-paper is a row in the Publications collection, because the school adds to that list regularly and a 33-entry nested list is not something anyone should have to scroll. This holds only what wraps them. \u26A0 THE BANNER, PAGE TITLE AND SEO ARE ON PAGE META for /publications/, which is where every page on the site keeps them, banner upload included.';
    displayName: 'Publications Page';
    pluralName: 'publications-pages';
    singularName: 'publications-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    groupHeadings: Schema.Attribute.Component<'shared.detail', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::publications-page.publications-page'
    > &
      Schema.Attribute.Private;
    myraPages: Schema.Attribute.Component<'publications.myra-page', true>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiReadingLanguagePageReadingLanguagePage
  extends Struct.SingleTypeSchema {
  collectionName: 'reading_language_pages';
  info: {
    description: 'The Reading & Language page (/academics/teaching-learning/reading-language/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. What differs is how the page lays that out, and the page owns it. Bands cannot be reordered, added or removed.';
    displayName: 'Reading & Language';
    pluralName: 'reading-language-pages';
    singularName: 'reading-language-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    close: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    lab: Schema.Attribute.Component<'structure.section', false>;
    lib: Schema.Attribute.Component<'structure.section', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::reading-language-page.reading-language-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    round: Schema.Attribute.Component<'structure.section', false>;
    stage: Schema.Attribute.Component<'structure.section', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiRemedialSupportPageRemedialSupportPage
  extends Struct.SingleTypeSchema {
  collectionName: 'remedial_support_pages';
  info: {
    description: 'The Remedial Support page (/academics/assessment/remedial-support/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. These pages carry no photographs; what differs between bands is how the page draws them, and the page owns that. Bands cannot be reordered, added or removed.';
    displayName: 'Remedial Support';
    pluralName: 'remedial-support-pages';
    singularName: 'remedial-support-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    close: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    journey: Schema.Attribute.Component<'structure.section', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::remedial-support-page.remedial-support-page'
    > &
      Schema.Attribute.Private;
    note: Schema.Attribute.Component<'structure.section', false>;
    open: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    rules: Schema.Attribute.Component<'structure.section', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiResultPageResultPage extends Struct.SingleTypeSchema {
  collectionName: 'result_page';
  info: {
    description: "The editable copy of /result/. \u26A0 THE PORTAL URL IS NOT HERE. It is Site Settings' `external.results` \u2014 the ERP address the school already owns in one place \u2014 and this page reads it from there rather than keeping a second copy that could disagree. \u26A0 NO SECURITY OR TECHNICAL CLAIM IS MADE ON THIS PAGE, deliberately: the brief warned against it, so the points describe where the portal is rather than promising anything about it.";
    displayName: 'Result Page';
    pluralName: 'result-pages';
    singularName: 'result-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cardBody: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    cardHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    cardKicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    cardPhoto: Schema.Attribute.Component<'shared.photo', false>;
    closeHeading: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    closePhoto: Schema.Attribute.Component<'shared.photo', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ctaLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::result-page.result-page'
    > &
      Schema.Attribute.Private;
    openBody: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    openHeading: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    openKicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    points: Schema.Attribute.Component<'shared.point', true>;
    publishedAt: Schema.Attribute.DateTime;
    sourcePage: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSecondaryStagePageSecondaryStagePage
  extends Struct.SingleTypeSchema {
  collectionName: 'secondary_stage_pages';
  info: {
    description: 'The Secondary page (/academics/structure/secondary/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. What differs between them is how the page lays that out, and the page owns that. Bands cannot be reordered, added or removed.';
    displayName: 'Secondary';
    pluralName: 'secondary-stage-pages';
    singularName: 'secondary-stage-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    beyond: Schema.Attribute.Component<'structure.section', false>;
    board: Schema.Attribute.Component<'structure.section', false>;
    close: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deep: Schema.Attribute.Component<'structure.section', false>;
    jrn: Schema.Attribute.Component<'structure.section', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::secondary-stage-page.secondary-stage-page'
    > &
      Schema.Attribute.Private;
    open: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSeniorSecondaryPageSeniorSecondaryPage
  extends Struct.SingleTypeSchema {
  collectionName: 'senior_secondary_pages';
  info: {
    description: 'The Senior Secondary page (/academics/structure/senior-secondary/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. What differs between them is how the page lays that out, and the page owns that. Bands cannot be reordered, added or removed.';
    displayName: 'Senior Secondary';
    pluralName: 'senior-secondary-pages';
    singularName: 'senior-secondary-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    beyond: Schema.Attribute.Component<'structure.section', false>;
    board: Schema.Attribute.Component<'structure.section', false>;
    close: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    jrn: Schema.Attribute.Component<'structure.section', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::senior-secondary-page.senior-secondary-page'
    > &
      Schema.Attribute.Private;
    more: Schema.Attribute.Component<'structure.section', false>;
    open: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSiteSettingSiteSetting extends Struct.SingleTypeSchema {
  collectionName: 'site_settings';
  info: {
    description: 'Global school information. Replaces the `school` export of apps/web/src/data/site.ts, which 57 files import \u2014 by a wide margin the most-used module in the project. Field names and nesting mirror it exactly so every consumer changes only its import line.';
    displayName: 'Site Settings';
    pluralName: 'site-settings';
    singularName: 'site-setting';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    address: Schema.Attribute.Component<'shared.address', false>;
    admissionsOpen: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    affiliation: Schema.Attribute.Component<'shared.affiliation', false>;
    classRange: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    contact: Schema.Attribute.Component<'shared.contact', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    currentStrength: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 24;
      }>;
    established: Schema.Attribute.Integer & Schema.Attribute.Required;
    external: Schema.Attribute.Component<'shared.external-links', false>;
    founders: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    groupFounded: Schema.Attribute.Integer;
    groupFoundedAt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    groupPhrase: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::site-setting.site-setting'
    > &
      Schema.Attribute.Private;
    motto: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    mottoParts: Schema.Attribute.Component<'shared.fact', true>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    openingStrength: Schema.Attribute.Integer;
    principal: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    quickAccess: Schema.Attribute.Component<'shared.link', true>;
    shortName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    social: Schema.Attribute.Component<'shared.social', false>;
    streams: Schema.Attribute.Component<'shared.fact', true>;
    tagline: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    teachingStaff: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 24;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSmartClassroomsPageSmartClassroomsPage
  extends Struct.SingleTypeSchema {
  collectionName: 'smart_classrooms_pages';
  info: {
    description: 'The Smart Classrooms page (/academics/teaching-learning/smart-classrooms/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. What differs is how the page lays that out, and the page owns it. Bands cannot be reordered, added or removed.';
    displayName: 'Smart Classrooms';
    pluralName: 'smart-classrooms-pages';
    singularName: 'smart-classrooms-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    beyond: Schema.Attribute.Component<'structure.section', false>;
    close: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::smart-classrooms-page.smart-classrooms-page'
    > &
      Schema.Attribute.Private;
    prac: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    room: Schema.Attribute.Component<'structure.section', false>;
    sys: Schema.Attribute.Component<'structure.section', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSportFacilitySportFacility
  extends Struct.CollectionTypeSchema {
  collectionName: 'sport_facilities';
  info: {
    description: 'A sporting venue on the campus. Mirrors the `facilities` export of apps/web/src/data/sports.ts. `lead` is the hero frame and `support` the rest \u2014 the page lays them out differently, so the split is content, not presentation.';
    displayName: 'Sport Facility';
    pluralName: 'sport-facilities';
    singularName: 'sport-facility';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }>;
    brief: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    lead: Schema.Attribute.Media<'images'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::sport-facility.sport-facility'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    notes: Schema.Attribute.Component<'shared.fact', true>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    support: Schema.Attribute.Component<'shared.photo', true>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSportsPageSportsPage extends Struct.SingleTypeSchema {
  collectionName: 'sports_page';
  info: {
    description: 'The headline figures, the participation ladder and the coaching claims on /beyond-academics/sports/. The games, facilities and record are Collections beside it.';
    displayName: 'Sports Page';
    pluralName: 'sports-pages';
    singularName: 'sports-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    coaching: Schema.Attribute.Component<'sports.coach-card', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    figures: Schema.Attribute.Component<'shared.figure', true>;
    ladder: Schema.Attribute.Component<'sports.rung', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::sports-page.sports-page'
    > &
      Schema.Attribute.Private;
    montage: Schema.Attribute.Component<'shared.photo', true>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSportsRecordSportsRecord
  extends Struct.CollectionTypeSchema {
  collectionName: 'sports_records';
  info: {
    description: 'One block of the sporting record \u2014 a championship or a season, with its podium placings and photographs. Mirrors the `record` export of apps/web/src/data/sportsRecord.ts.';
    displayName: 'Sports Record';
    pluralName: 'sports-records';
    singularName: 'sports-record';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::sports-record.sports-record'
    > &
      Schema.Attribute.Private;
    more: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    podiums: Schema.Attribute.Component<'sports.podium', true>;
    publishedAt: Schema.Attribute.DateTime;
    shots: Schema.Attribute.Component<'shared.photo', true>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiStemRoboticsPageStemRoboticsPage
  extends Struct.SingleTypeSchema {
  collectionName: 'stem_robotics_pages';
  info: {
    description: 'The STEM & Robotics page (/academics/teaching-learning/stem-robotics/) \u2014 one named field per band of the page, in the order a reader meets them. \u26A0 Every band is the same shape: a label, a heading, paragraphs, photographs and a run of cells. What differs is how the page lays that out, and the page owns it. Bands cannot be reordered, added or removed.';
    displayName: 'STEM & Robotics';
    pluralName: 'stem-robotics-pages';
    singularName: 'stem-robotics-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bots: Schema.Attribute.Component<'structure.section', false>;
    close: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eco: Schema.Attribute.Component<'structure.section', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::stem-robotics-page.stem-robotics-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    rooms: Schema.Attribute.Component<'structure.section', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    use: Schema.Attribute.Component<'structure.section', false>;
  };
}

export interface ApiStreamsOfferedPageStreamsOfferedPage
  extends Struct.SingleTypeSchema {
  collectionName: 'streams_offered_pages';
  info: {
    description: 'The Streams Offered page (/academics/structure/streams-offered/) \u2014 the streams at the top, edited once, then one named field per band of the page. \u26A0 Bands cannot be reordered, added or removed.';
    displayName: 'Streams Offered';
    pluralName: 'streams-offered-pages';
    singularName: 'streams-offered-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dir: Schema.Attribute.Component<'structure.section', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::streams-offered-page.streams-offered-page'
    > &
      Schema.Attribute.Private;
    paths: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    streams: Schema.Attribute.Component<'structure.stream', true>;
    sure: Schema.Attribute.Component<'structure.section', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    x: Schema.Attribute.Component<'structure.section', false>;
  };
}

export interface ApiStudentCentredLearningPageStudentCentredLearningPage
  extends Struct.SingleTypeSchema {
  collectionName: 'student_centred_learning_pages';
  info: {
    description: "The four sections of /academics/philosophy/student-centred-learning/, in the order they appear. \u26A0\u26A0 FIXED FIELDS, NOT A LIST \u2014 the page cannot be reordered from here, a section cannot be deleted and no new one added. \u26A0 THREE OF THE FOUR COMPONENTS ARE SHARED WITH TEACHING PHILOSOPHY. Only the collage in 02 is new; the statement, the constellation and the closing band already existed, which is the point of building these by shape rather than one set per page. \u26A0 NEVER HERE: the 01\u201303 numerals, the washes and grids, the float ornaments, the collage geometry, the orbit radius and each node's angle, and the section order.";
    displayName: 'Student-Centred Learning';
    pluralName: 'student-centred-learning-pages';
    singularName: 'student-centred-learning-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    close: Schema.Attribute.Component<'philosophy.close', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::student-centred-learning-page.student-centred-learning-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sectionOne: Schema.Attribute.Component<'philosophy.statement', false>;
    sectionThree: Schema.Attribute.Component<'philosophy.constellation', false>;
    sectionTwo: Schema.Attribute.Component<'philosophy.collage', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiStudentCouncilPageStudentCouncilPage
  extends Struct.SingleTypeSchema {
  collectionName: 'student_council_page';
  info: {
    description: "The roll on /beyond-academics/student-council/ \u2014 the school's own council board and the forty-five names on it. \u26A0\u26A0 ONE RECORD, NOT ONE PER CHILD, BECAUSE THE WHOLE COUNCIL TURNS OVER AT ONCE. A new session means a new board artwork and a new roll together, so they are edited together and cannot drift apart. \u26A0\u26A0 THE BOARD IMAGE AND THE FOUR LISTS ARE THE SAME PEOPLE AND MUST BE CHANGED IN THE SAME SAVE. Upload the new board and leave the lists, and the page shows this year's faces above last year's names \u2014 on screen, to parents, with nothing to indicate it. \u26A0 EVERY NAME AND POST IS COPIED EXACTLY AS THE BOARD PRINTS IT, misspellings included. See the note on the Council post component before correcting anything.";
    displayName: 'Student Council';
    pluralName: 'student-council-pages';
    singularName: 'student-council-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    board: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    juniorOffices: Schema.Attribute.Component<'council.post', true>;
    juniorPosts: Schema.Attribute.Component<'council.post', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::student-council-page.student-council-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    seniorOffices: Schema.Attribute.Component<'council.post', true>;
    seniorPosts: Schema.Attribute.Component<'council.post', true>;
    session: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 16;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSubjectCombinationsPageSubjectCombinationsPage
  extends Struct.SingleTypeSchema {
  collectionName: 'subject_combinations_pages';
  info: {
    description: 'The Subject Combinations page (/academics/structure/subject-combinations/) \u2014 the streams at the top, edited once, then one named field per band of the page. \u26A0 Bands cannot be reordered, added or removed.';
    displayName: 'Subject Combinations';
    pluralName: 'subject-combinations-pages';
    singularName: 'subject-combinations-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    close: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::subject-combinations-page.subject-combinations-page'
    > &
      Schema.Attribute.Private;
    map: Schema.Attribute.Component<'structure.section', false>;
    open: Schema.Attribute.Component<'structure.section', false>;
    publishedAt: Schema.Attribute.DateTime;
    streams: Schema.Attribute.Component<'structure.stream', true>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    worlds: Schema.Attribute.Component<'structure.section', false>;
  };
}

export interface ApiTcPageTcPage extends Struct.SingleTypeSchema {
  collectionName: 'tc_page';
  info: {
    description: "The editable copy of /download-tc/. \u26A0 THE LOOKUP ITSELF STAYS IN CODE \u2014 the endpoint, the field name the school's system expects, the fetch and the response handling are integration, not content. What lives here is every word a parent reads, including the validation and status messages, which were previously strings inside a <script> and therefore unreachable. \u26A0 NO ENDPOINT IS CONFIGURED YET: the form explains that the school's own page has the working lookup and sends the reader there, rather than showing a fabricated result. \u26A0 `{officePhone}` IN ANY FIELD IS FILLED FROM SITE SETTINGS \u2014 the number belongs there, and a hardcoded copy in this page's script is exactly the bug this replaces.";
    displayName: 'Transfer Certificate Page';
    pluralName: 'tc-pages';
    singularName: 'tc-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    busyLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    cardBody: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    cardHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    errEmpty: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    errShort: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    fieldLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    fieldPlaceholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    formNote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    help: Schema.Attribute.Component<'shared.point', true>;
    helpTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::tc-page.tc-page'
    > &
      Schema.Attribute.Private;
    photo: Schema.Attribute.Component<'shared.photo', false>;
    publishedAt: Schema.Attribute.DateTime;
    sourcePage: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    statusError: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    statusFound: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    statusFoundLink: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    statusNoEndpointLead: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    statusNoEndpointLink: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    statusNoEndpointTail: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    statusNotFound: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    submitLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTeacherTeacher extends Struct.CollectionTypeSchema {
  collectionName: 'teachers';
  info: {
    description: "One row of the Mandatory Public Disclosure's teacher table \u2014 all 131 of them. \u26A0\u26A0 DO NOT TIDY THE CAPITALISATION OR THE QUALIFICATION SPELLINGS. 'bachelor of engineering with b.ed' and 'masters of arts with ,masters in education' are what the school filed with CBSE. Correcting them here makes this page disagree with the PDF beside it, and the PDF is the document of record. \u26A0 `filedOrder` IS THE ROW NUMBER IN THE FILING, kept so the page can present the table in the order it was submitted rather than alphabetically. \u26A0 The page's designation filter is DERIVED from the distinct values here \u2014 adding a designation needs no code change.";
    displayName: 'Teacher';
    pluralName: 'teachers';
    singularName: 'teacher';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    designation: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    filedOrder: Schema.Attribute.Integer & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::teacher.teacher'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    qualification: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTeachingPhilosophyPageTeachingPhilosophyPage
  extends Struct.SingleTypeSchema {
  collectionName: 'teaching_philosophy_pages';
  info: {
    description: "The five sections and the closing band of /academics/philosophy/teaching-philosophy/, in the order they appear on the page. \u26A0\u26A0 THE SECTIONS ARE FIXED FIELDS, NOT A LIST. Each one is a named, single component, so the page cannot be reordered, a section cannot be deleted and no new one can be added \u2014 the design owns the composition and this owns the words. \u26A0 WHAT IS NEVER HERE: the 01\u201305 numerals, the washes, grids, dot fields and float ornaments, the parallax and reveal delays, the constellation's radius and node angles, and the section order. All of it stays in TeachingPhilosophyPage.astro.";
    displayName: 'Teaching Philosophy';
    pluralName: 'teaching-philosophy-pages';
    singularName: 'teaching-philosophy-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    close: Schema.Attribute.Component<'philosophy.close', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::teaching-philosophy-page.teaching-philosophy-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sectionFive: Schema.Attribute.Component<'philosophy.statement', false>;
    sectionFour: Schema.Attribute.Component<'philosophy.statement', false>;
    sectionOne: Schema.Attribute.Component<'philosophy.statement', false>;
    sectionThree: Schema.Attribute.Component<'philosophy.constellation', false>;
    sectionTwo: Schema.Attribute.Component<'philosophy.pair', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTransportPageTransportPage extends Struct.SingleTypeSchema {
  collectionName: 'transport_page';
  info: {
    description: "The prose of /campus/transport/. \u26A0 IT HOLDS NO COUNTS. Buses, runs and boarding points are computed from Bus Route at query time \u2014 storing them would give the same fact two owners and go stale the day a route is added. \u26A0 THE BAND HEADS \u2014 overview, finder, safetyHead, contactHead \u2014 are the eyebrow, heading and body of each band on /campus/transport/. kicker = the eyebrow; the FIRST paragraph of body = the prose under it. \u26A0\u26A0 TWO OF THOSE BODIES CARRY TOKENS: {buses}, {runs} and {stops} are replaced at build time with counts computed from the Bus Route collection. Type the words, keep the braces \u2014 a number typed in their place is frozen the day a route changes. \u26A0 overviewFigures ARE CAPTIONS ONLY. The numbers above them are computed from Bus Route and are NOT stored; `label` is the caption and `body` the note beneath it. \u26A0 NOT EDITABLE HERE: the section-rail labels (tied to DOM ids) and the route finder's interface \u2014 its search placeholder, A\u2013Z jump, 'First stop' / 'Last stop' / 'Driver' labels and its empty state. \u26A0 THE SEVEN `finder*` STRINGS are the route finder's own prose \u2014 its search label, the 'Areas we cover' heading, the staff-bus and driver notes, and the empty state with its call to action. What is STILL not editable there is data labelling only: 'First stop', 'Last stop', 'Driver', '/stop', 'Single run' and the A\u2013Z jump, which label the route data rather than say anything.";
    displayName: 'Transport Page';
    pluralName: 'transport-pages';
    singularName: 'transport-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    contactHead: Schema.Attribute.Component<'structure.section', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    finder: Schema.Attribute.Component<'structure.section', false>;
    finderAreasHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 90;
      }>;
    finderDriverNote: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    finderEmptyBody: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    finderEmptyCta: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    finderEmptyHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    finderSearchLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 90;
      }>;
    finderStaffNote: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transport-page.transport-page'
    > &
      Schema.Attribute.Private;
    overview: Schema.Attribute.Component<'structure.section', false>;
    overviewCta: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    overviewFigures: Schema.Attribute.Component<'shared.measure', true>;
    publishedAt: Schema.Attribute.DateTime;
    safety: Schema.Attribute.Component<'shared.measure', true>;
    safetyHead: Schema.Attribute.Component<'structure.section', false>;
    stopAliases: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiUniformPageUniformPage extends Struct.SingleTypeSchema {
  collectionName: 'uniform_page';
  info: {
    description: "The uniform catalogue page at /admissions/uniform-catalogue/. Replaces apps/web/src/data/uniform.ts. \u26A0 THE CATALOGUES THEMSELVES ARE NOW STRAPI MEDIA. They were two PDFs sitting in the site's public directory (51 MB), so publishing a new edition meant a developer and a deploy; it is now an upload. \u26A0 EVERYTHING BELOW THE CATALOGUES IS READ OUT OF THEM \u2014 the class groups, the seasons, the shoe table and the school's own eleven notes are transcriptions, not this project's wording, and the shoe table keeps the document's own 2023-24 session heading even though the cover says 2025-26.";
    displayName: 'Uniform Page';
    pluralName: 'uniform-pages';
    singularName: 'uniform-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    catalogues: Schema.Attribute.Component<'uniform.catalogue', true>;
    classesHeading: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    classesKicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    classesNote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    classGroups: Schema.Attribute.Component<'shared.point', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    downloadHeading: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    downloadKicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    downloadNote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::uniform-page.uniform-page'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Component<'shared.paragraph', true>;
    notesBody: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    notesTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    seasons: Schema.Attribute.Component<'shared.detail', true>;
    seasonsHeading: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    seasonsKicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    shoeRows: Schema.Attribute.Component<'uniform.shoe-row', true>;
    shoesHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    shoesKicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    shoesNote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    sourceHref: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    sourceLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    topBody: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    topHeading: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    topKicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    topNote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiUniformedGroupsPageUniformedGroupsPage
  extends Struct.SingleTypeSchema {
  collectionName: 'uniformed_groups_pages';
  info: {
    description: 'Beyond Academics \u2192 NCC, Scouts & Guides. Both groups, their facts, their record and their photographs. \u26A0 THE BANNER, PAGE TITLE AND SEO ARE ON PAGE META for /beyond-academics/ncc-scouts-guides/, as they are for every page on this site. \u26A0\u26A0 FOUR THINGS MOVE TOGETHER if this page is ever renamed: the group names here, the page\u2019s two titles on Page Meta, its meta description, and the nav label in src/data/navigation.ts ("NCC, Scouts & Guides"). Narrow one and you have to do all four.';
    displayName: 'NCC, Scouts & Guides Page';
    pluralName: 'uniformed-groups-pages';
    singularName: 'uniformed-groups-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    groups: Schema.Attribute.Component<'uniformed.group', true>;
    intro: Schema.Attribute.Component<'structure.section', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::uniformed-groups-page.uniformed-groups-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiVisionMissionPageVisionMissionPage
  extends Struct.SingleTypeSchema {
  collectionName: 'vision_mission_page';
  info: {
    description: 'The prose of /about/vision-mission/. \u26A0 `keys` STAYS IN CODE \u2014 it is {name,hex,fill,text}, a colour palette driving the cipher animation, which is design rather than editorial content. \u26A0 docs/07 A3 is still open: the school has published no formal Vision and Mission statement, so this page carries what it has rather than an invented one.';
    displayName: 'Vision & Mission Page';
    pluralName: 'vision-mission-pages';
    singularName: 'vision-mission-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cipher: Schema.Attribute.Component<'shared.paragraph', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    greeting: Schema.Attribute.Component<'shared.paragraph', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::vision-mission-page.vision-mission-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.Text;
    caption: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    focalPoint: Schema.Attribute.JSON;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.Text;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.Text & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::session': AdminSession;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::academic-calendar-page.academic-calendar-page': ApiAcademicCalendarPageAcademicCalendarPage;
      'api::academic-topic.academic-topic': ApiAcademicTopicAcademicTopic;
      'api::achievement-major.achievement-major': ApiAchievementMajorAchievementMajor;
      'api::achievement-record.achievement-record': ApiAchievementRecordAchievementRecord;
      'api::achievements-page.achievements-page': ApiAchievementsPageAchievementsPage;
      'api::advisory-council.advisory-council': ApiAdvisoryCouncilAdvisoryCouncil;
      'api::alumni-meet.alumni-meet': ApiAlumniMeetAlumniMeet;
      'api::alumni-registration.alumni-registration': ApiAlumniRegistrationAlumniRegistration;
      'api::alumni-story.alumni-story': ApiAlumniStoryAlumniStory;
      'api::alumnus.alumnus': ApiAlumnusAlumnus;
      'api::assessment-page.assessment-page': ApiAssessmentPageAssessmentPage;
      'api::bus-route.bus-route': ApiBusRouteBusRoute;
      'api::calendar-document.calendar-document': ApiCalendarDocumentCalendarDocument;
      'api::campus-facility.campus-facility': ApiCampusFacilityCampusFacility;
      'api::campus-safety-page.campus-safety-page': ApiCampusSafetyPageCampusSafetyPage;
      'api::campus-tour-page.campus-tour-page': ApiCampusTourPageCampusTourPage;
      'api::career-page.career-page': ApiCareerPageCareerPage;
      'api::class-corner-document.class-corner-document': ApiClassCornerDocumentClassCornerDocument;
      'api::class-timetable.class-timetable': ApiClassTimetableClassTimetable;
      'api::competitive-exam-page.competitive-exam-page': ApiCompetitiveExamPageCompetitiveExamPage;
      'api::contact-enquiry.contact-enquiry': ApiContactEnquiryContactEnquiry;
      'api::contact-page.contact-page': ApiContactPageContactPage;
      'api::credential.credential': ApiCredentialCredential;
      'api::critical-thinking-page.critical-thinking-page': ApiCriticalThinkingPageCriticalThinkingPage;
      'api::curriculum-page.curriculum-page': ApiCurriculumPageCurriculumPage;
      'api::disclosure-page.disclosure-page': ApiDisclosurePageDisclosurePage;
      'api::excursion-section.excursion-section': ApiExcursionSectionExcursionSection;
      'api::expedition.expedition': ApiExpeditionExpedition;
      'api::experiential-inquiry-page.experiential-inquiry-page': ApiExperientialInquiryPageExperientialInquiryPage;
      'api::experiential-learning-page.experiential-learning-page': ApiExperientialLearningPageExperientialLearningPage;
      'api::facilities-page.facilities-page': ApiFacilitiesPageFacilitiesPage;
      'api::game.game': ApiGameGame;
      'api::history-page.history-page': ApiHistoryPageHistoryPage;
      'api::homepage.homepage': ApiHomepageHomepage;
      'api::homework-policy-page.homework-policy-page': ApiHomeworkPolicyPageHomeworkPolicyPage;
      'api::job-posting.job-posting': ApiJobPostingJobPosting;
      'api::laboratories-clubs-page.laboratories-clubs-page': ApiLaboratoriesClubsPageLaboratoriesClubsPage;
      'api::leader-message.leader-message': ApiLeaderMessageLeaderMessage;
      'api::mentoring-page.mentoring-page': ApiMentoringPageMentoringPage;
      'api::methodology-page.methodology-page': ApiMethodologyPageMethodologyPage;
      'api::middle-school-page.middle-school-page': ApiMiddleSchoolPageMiddleSchoolPage;
      'api::news-category-page.news-category-page': ApiNewsCategoryPageNewsCategoryPage;
      'api::news-item.news-item': ApiNewsItemNewsItem;
      'api::notice.notice': ApiNoticeNotice;
      'api::page-meta.page-meta': ApiPageMetaPageMeta;
      'api::parent-feedback.parent-feedback': ApiParentFeedbackParentFeedback;
      'api::parent-teacher-page.parent-teacher-page': ApiParentTeacherPageParentTeacherPage;
      'api::parent-testimonial.parent-testimonial': ApiParentTestimonialParentTestimonial;
      'api::pre-primary-page.pre-primary-page': ApiPrePrimaryPagePrePrimaryPage;
      'api::primary-stage-page.primary-stage-page': ApiPrimaryStagePagePrimaryStagePage;
      'api::publication.publication': ApiPublicationPublication;
      'api::publications-page.publications-page': ApiPublicationsPagePublicationsPage;
      'api::reading-language-page.reading-language-page': ApiReadingLanguagePageReadingLanguagePage;
      'api::remedial-support-page.remedial-support-page': ApiRemedialSupportPageRemedialSupportPage;
      'api::result-page.result-page': ApiResultPageResultPage;
      'api::secondary-stage-page.secondary-stage-page': ApiSecondaryStagePageSecondaryStagePage;
      'api::senior-secondary-page.senior-secondary-page': ApiSeniorSecondaryPageSeniorSecondaryPage;
      'api::site-setting.site-setting': ApiSiteSettingSiteSetting;
      'api::smart-classrooms-page.smart-classrooms-page': ApiSmartClassroomsPageSmartClassroomsPage;
      'api::sport-facility.sport-facility': ApiSportFacilitySportFacility;
      'api::sports-page.sports-page': ApiSportsPageSportsPage;
      'api::sports-record.sports-record': ApiSportsRecordSportsRecord;
      'api::stem-robotics-page.stem-robotics-page': ApiStemRoboticsPageStemRoboticsPage;
      'api::streams-offered-page.streams-offered-page': ApiStreamsOfferedPageStreamsOfferedPage;
      'api::student-centred-learning-page.student-centred-learning-page': ApiStudentCentredLearningPageStudentCentredLearningPage;
      'api::student-council-page.student-council-page': ApiStudentCouncilPageStudentCouncilPage;
      'api::subject-combinations-page.subject-combinations-page': ApiSubjectCombinationsPageSubjectCombinationsPage;
      'api::tc-page.tc-page': ApiTcPageTcPage;
      'api::teacher.teacher': ApiTeacherTeacher;
      'api::teaching-philosophy-page.teaching-philosophy-page': ApiTeachingPhilosophyPageTeachingPhilosophyPage;
      'api::transport-page.transport-page': ApiTransportPageTransportPage;
      'api::uniform-page.uniform-page': ApiUniformPageUniformPage;
      'api::uniformed-groups-page.uniformed-groups-page': ApiUniformedGroupsPageUniformedGroupsPage;
      'api::vision-mission-page.vision-mission-page': ApiVisionMissionPageVisionMissionPage;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
