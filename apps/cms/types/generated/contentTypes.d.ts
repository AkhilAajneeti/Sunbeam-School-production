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
    description: "Safety bands, the security plan's markers, and the emergency procedure. Mirrors apps/web/src/data/campus.ts.";
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
    publishedAt: Schema.Attribute.DateTime;
    safetyGroups: Schema.Attribute.Component<'campus.safety-group', true>;
    surveillanceCards: Schema.Attribute.Component<'shared.point', true>;
    transportFeatures: Schema.Attribute.Component<'shared.measure', true>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wellbeingCards: Schema.Attribute.Component<'shared.point', true>;
  };
}

export interface ApiCampusTourPageCampusTourPage
  extends Struct.SingleTypeSchema {
  collectionName: 'campus_tour_page';
  info: {
    description: 'The overview stats and journey band of /campus/. The facilities themselves are a Collection beside this.';
    displayName: 'Campus Tour Page';
    pluralName: 'campus-tour-pages';
    singularName: 'campus-tour-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    journey: Schema.Attribute.Component<'shared.point', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::campus-tour-page.campus-tour-page'
    > &
      Schema.Attribute.Private;
    overviewStats: Schema.Attribute.Component<'shared.stat', true>;
    publishedAt: Schema.Attribute.DateTime;
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

export interface ApiFacilitiesPageFacilitiesPage
  extends Struct.SingleTypeSchema {
  collectionName: 'facilities_page';
  info: {
    description: 'The infrastructure page. Mirrors apps/web/src/data/facilities.ts \u2014 KPIs, grouped inventory, rationale cards and the growth progression.';
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

export interface ApiLeaderMessageLeaderMessage
  extends Struct.CollectionTypeSchema {
  collectionName: 'leader_messages';
  info: {
    description: "The Director's and the Principal's messages. ONE type, two records \u2014 the pages are the same component with different content, so a second type would be the same nine fields under another name. `pending` states what the school has still to supply, which docs/07 A5 tracks for the Principal's message.";
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
    role: Schema.Attribute.Enumeration<['director', 'principal']> &
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
    description: 'The prose of /campus/transport/. \u26A0 IT HOLDS NO COUNTS. Buses, runs and boarding points are computed from Bus Route at query time \u2014 storing them would give the same fact two owners and go stale the day a route is added.';
    displayName: 'Transport Page';
    pluralName: 'transport-pages';
    singularName: 'transport-page';
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
      'api::transport-page.transport-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    safety: Schema.Attribute.Component<'shared.measure', true>;
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
      'api::alumni-meet.alumni-meet': ApiAlumniMeetAlumniMeet;
      'api::alumni-story.alumni-story': ApiAlumniStoryAlumniStory;
      'api::alumnus.alumnus': ApiAlumnusAlumnus;
      'api::bus-route.bus-route': ApiBusRouteBusRoute;
      'api::calendar-document.calendar-document': ApiCalendarDocumentCalendarDocument;
      'api::campus-facility.campus-facility': ApiCampusFacilityCampusFacility;
      'api::campus-safety-page.campus-safety-page': ApiCampusSafetyPageCampusSafetyPage;
      'api::campus-tour-page.campus-tour-page': ApiCampusTourPageCampusTourPage;
      'api::contact-page.contact-page': ApiContactPageContactPage;
      'api::credential.credential': ApiCredentialCredential;
      'api::critical-thinking-page.critical-thinking-page': ApiCriticalThinkingPageCriticalThinkingPage;
      'api::curriculum-page.curriculum-page': ApiCurriculumPageCurriculumPage;
      'api::disclosure-page.disclosure-page': ApiDisclosurePageDisclosurePage;
      'api::excursion-section.excursion-section': ApiExcursionSectionExcursionSection;
      'api::expedition.expedition': ApiExpeditionExpedition;
      'api::experiential-inquiry-page.experiential-inquiry-page': ApiExperientialInquiryPageExperientialInquiryPage;
      'api::facilities-page.facilities-page': ApiFacilitiesPageFacilitiesPage;
      'api::game.game': ApiGameGame;
      'api::history-page.history-page': ApiHistoryPageHistoryPage;
      'api::homepage.homepage': ApiHomepageHomepage;
      'api::job-posting.job-posting': ApiJobPostingJobPosting;
      'api::leader-message.leader-message': ApiLeaderMessageLeaderMessage;
      'api::middle-school-page.middle-school-page': ApiMiddleSchoolPageMiddleSchoolPage;
      'api::news-category-page.news-category-page': ApiNewsCategoryPageNewsCategoryPage;
      'api::news-item.news-item': ApiNewsItemNewsItem;
      'api::notice.notice': ApiNoticeNotice;
      'api::page-meta.page-meta': ApiPageMetaPageMeta;
      'api::pre-primary-page.pre-primary-page': ApiPrePrimaryPagePrePrimaryPage;
      'api::primary-stage-page.primary-stage-page': ApiPrimaryStagePagePrimaryStagePage;
      'api::result-page.result-page': ApiResultPageResultPage;
      'api::secondary-stage-page.secondary-stage-page': ApiSecondaryStagePageSecondaryStagePage;
      'api::senior-secondary-page.senior-secondary-page': ApiSeniorSecondaryPageSeniorSecondaryPage;
      'api::site-setting.site-setting': ApiSiteSettingSiteSetting;
      'api::sport-facility.sport-facility': ApiSportFacilitySportFacility;
      'api::sports-page.sports-page': ApiSportsPageSportsPage;
      'api::sports-record.sports-record': ApiSportsRecordSportsRecord;
      'api::streams-offered-page.streams-offered-page': ApiStreamsOfferedPageStreamsOfferedPage;
      'api::student-centred-learning-page.student-centred-learning-page': ApiStudentCentredLearningPageStudentCentredLearningPage;
      'api::subject-combinations-page.subject-combinations-page': ApiSubjectCombinationsPageSubjectCombinationsPage;
      'api::tc-page.tc-page': ApiTcPageTcPage;
      'api::teacher.teacher': ApiTeacherTeacher;
      'api::teaching-philosophy-page.teaching-philosophy-page': ApiTeachingPhilosophyPageTeachingPhilosophyPage;
      'api::transport-page.transport-page': ApiTransportPageTransportPage;
      'api::uniform-page.uniform-page': ApiUniformPageUniformPage;
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
