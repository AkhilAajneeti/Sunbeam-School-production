import type { Schema, Struct } from '@strapi/strapi';

export interface AboutTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_about_testimonials';
  info: {
    description: 'A named voice on the history page, with a portrait. \u26A0 docs/07 C5 governs publishing names and photographs \u2014 a testimonial without consent recorded should not be added here.';
    displayName: 'Testimonial';
    icon: 'quote';
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    paragraphs: Schema.Attribute.Component<'shared.paragraph', true>;
    portrait: Schema.Attribute.Media<'images'>;
    role: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface AcademicsAward extends Struct.ComponentSchema {
  collectionName: 'components_academics_awards';
  info: {
    description: "One olympiad or competition record, as the school published it \u2014 title, category, the classes it was open to, the year, and the certificate or notice image beside it. \u26A0 `link` IS THE SCHOOL'S OWN POST about the result. Nothing here is composed: a competition the school has not announced does not get an entry.";
    displayName: 'Award';
    icon: 'medal';
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    category: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    classes: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    year: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
  };
}

export interface AcademicsClassDoc extends Struct.ComponentSchema {
  collectionName: 'components_academics_class_docs';
  info: {
    description: 'One class and its published syllabus \u2014 either an uploaded PDF or a link to one. \u26A0 With neither, the card says the syllabus is issued by the school instead of pretending to be a download.';
    displayName: 'Class syllabus';
    icon: 'file';
  };
  attributes: {
    file: Schema.Attribute.Media<'files'>;
    href: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    sizeMb: Schema.Attribute.Integer;
  };
}

export interface AcademicsFaq extends Struct.ComponentSchema {
  collectionName: 'components_academics_faqs';
  info: {
    description: "One question and its answer. \u26A0 `answers` IS A LIST OF PARAGRAPHS, not one block of text \u2014 several answers run to two or three, and the page prints each as its own <p>. \u26A0 THE ANSWER CARRIES EMPHASIS. It was written as HTML because the emphasis is part of the meaning ('Nursery to Class IX'); it is stored with the `**` marker and rendered by ui/RichLine.astro, so the CMS never holds raw markup. \u26A0 `cta` NEEDS ITS LABEL AND ITS external FLAG, which is why it is a link component rather than a bare href \u2014 squeezing it into one it lost both.";
    displayName: 'FAQ';
    icon: 'question';
  };
  attributes: {
    answers: Schema.Attribute.Component<'shared.paragraph', true>;
    cta: Schema.Attribute.Component<'shared.link', false>;
    note: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    question: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface AcademicsLede extends Struct.ComponentSchema {
  collectionName: 'components_academics_ledes';
  info: {
    description: 'The small label, the heading and the paragraphs that open a section. \u26A0 The line break in the heading is drawn by the page \u2014 type the two halves and it sets the second in italic.';
    displayName: 'Section opening';
    icon: 'quote';
  };
  attributes: {
    body: Schema.Attribute.Component<'shared.paragraph', true>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 140;
      }>;
    headingEm: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 140;
      }>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
  };
}

export interface AcademicsResult extends Struct.ComponentSchema {
  collectionName: 'components_academics_results';
  info: {
    description: "One named student result \u2014 the examination and the score, with the school's own announcement image. \u26A0 `score` IS A STRING. The school files ranks, percentiles, bands and marks in one list; forcing them to a number would lose the ones that are not numbers and round the ones that are.";
    displayName: 'Named Result';
    icon: 'chartCircle';
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    exam: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    score: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
  };
}

export interface AcademicsStage extends Struct.ComponentSchema {
  collectionName: 'components_academics_stages';
  info: {
    description: 'One stage of school and the classes in it. \u26A0 Used TWICE on the page \u2014 as a step on the journey at the top and as a row in the library below. Editing it here changes both.';
    displayName: 'Stage';
    icon: 'layer';
  };
  attributes: {
    blurb: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    classes: Schema.Attribute.Component<'academics.class-doc', true>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    mark: Schema.Attribute.Enumeration<
      [
        'book',
        'hands',
        'clipboard',
        'speech',
        'chart',
        'cup',
        'calendar',
        'doc',
        'pen',
        'desk',
        'flask',
        'sun',
        'clock',
        'hourglass',
        'search',
        'target',
        'bulb',
        'medal',
        'shield',
        'bell',
        'handHeart',
        'eye',
        'person',
        'head',
        'grow',
        'quote',
        'arrow',
        'download',
        'external',
        'chat',
        'atom',
        'present',
        'layers',
        'refresh',
        'hand',
        'megaphone',
        'ribbon',
        'bookmark',
        'globe',
        'cap',
        'pin',
        'seat',
        'spark',
        'route',
        'leaf',
        'scroll',
        'phone',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'book'>;
    range: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface AcademicsStory extends Struct.ComponentSchema {
  collectionName: 'components_academics_stories';
  info: {
    description: "One named student success story. \u26A0\u26A0 NAMING A CHILD IS A CONSENT DECISION (docs/07 C5). Every entry here is one the school has itself published; nothing is written from a rumour or a staff-room mention, and a story without a published source should not be added. \u26A0 `poster` IS THE SCHOOL'S OWN ANNOUNCEMENT GRAPHIC where it made one, distinct from a photograph of the student.";
    displayName: 'Student Story';
    icon: 'user';
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    category: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1500;
      }>;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    location: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    poster: Schema.Attribute.Media<'images'>;
    student: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    year: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
  };
}

export interface AcademicsStream extends Struct.ComponentSchema {
  collectionName: 'components_academics_streams';
  info: {
    description: "One Class XI\u2013XII stream and the subjects in it. \u26A0 `core`, `optional` and `additional` ARE THREE SEPARATE LISTS because CBSE treats them separately and a parent choosing a combination needs to see which is which \u2014 merging them would lose the distinction the page exists to make. \u26A0 `coreUnverified` / `unverified` MARK WHAT THE SCHOOL HAS NOT PUBLISHED. The page prints a qualifier rather than presenting an assumption as fact; a school site that invents a subject offering does real damage. \u26A0 `accent` AND `glyph` ARE NOT HERE \u2014 they are the tint and the icon the layout uses, they stay in the component, and they are keyed off the stream's name.";
    displayName: 'Stream';
    icon: 'apps';
  };
  attributes: {
    additional: Schema.Attribute.Component<'shared.fact', true>;
    body: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    core: Schema.Attribute.Component<'shared.fact', true>;
    coreUnverified: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    fullName: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    key: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    number: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 8;
      }>;
    optional: Schema.Attribute.Component<'shared.fact', true>;
    unverified: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface AcademicsTile extends Struct.ComponentSchema {
  collectionName: 'components_academics_tiles';
  info: {
    description: 'One card: a name, a line under it and a symbol. \u26A0 The colour of the symbol is chosen by the page from its own palette \u2014 cards recolour themselves as you add or remove them.';
    displayName: 'Tile';
    icon: 'grid';
  };
  attributes: {
    file: Schema.Attribute.Media<'files'>;
    href: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    mark: Schema.Attribute.Enumeration<
      [
        'book',
        'hands',
        'clipboard',
        'speech',
        'chart',
        'cup',
        'calendar',
        'doc',
        'pen',
        'desk',
        'flask',
        'sun',
        'clock',
        'hourglass',
        'search',
        'target',
        'bulb',
        'medal',
        'shield',
        'bell',
        'handHeart',
        'eye',
        'person',
        'head',
        'grow',
        'quote',
        'arrow',
        'download',
        'external',
        'chat',
        'atom',
        'present',
        'layers',
        'refresh',
        'hand',
        'megaphone',
        'ribbon',
        'bookmark',
        'globe',
        'cap',
        'pin',
        'seat',
        'spark',
        'route',
        'leaf',
        'scroll',
        'phone',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'bulb'>;
    value: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
  };
}

export interface AcademicsTiles extends Struct.ComponentSchema {
  collectionName: 'components_academics_tile_sections';
  info: {
    description: 'A section opening followed by a run of cards. \u26A0 The grid, the colours and the reveal delays are design and stay in the page.';
    displayName: 'Tiles section';
    icon: 'grid';
  };
  attributes: {
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 140;
      }>;
    headingEm: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 140;
      }>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    tiles: Schema.Attribute.Component<'academics.tile', true>;
  };
}

export interface AchievementsRecordBoard extends Struct.ComponentSchema {
  collectionName: 'components_achievements_record_boards';
  info: {
    description: 'The heading above one of the two boards on Beyond Academics \u2192 Achievements. \u26A0 `category` IS A JOIN KEY, NOT A LABEL \u2014 it must match the `category` on the Achievement Records that belong under this heading, or the board renders empty. Change the label freely; change the category only if you are also re-categorising the records themselves.';
    displayName: 'Record Board';
    icon: 'trophy';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<['sport', 'academic']> &
      Schema.Attribute.Required;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    note: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface CampusFacilityGroup extends Struct.ComponentSchema {
  collectionName: 'components_campus_facility_groups';
  info: {
    description: 'One band of the infrastructure page \u2014 heading plus its inventory.';
    displayName: 'Facility Group';
    icon: 'layer';
  };
  attributes: {
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    groupId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    items: Schema.Attribute.Component<'campus.facility-item', true>;
    stand: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface CampusFacilityItem extends Struct.ComponentSchema {
  collectionName: 'components_campus_facility_items';
  info: {
    description: 'One line of the infrastructure inventory. `unlisted` marks a facility the school has NOT published \u2014 the page shows it differently rather than claiming it.';
    displayName: 'Facility Item';
    icon: 'bulletList';
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    photo: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    unlisted: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface CampusMapPoint extends Struct.ComponentSchema {
  collectionName: 'components_campus_map_points';
  info: {
    description: 'One marker on the campus security plan. x/y are PERCENTAGES of the plan image, not pixels \u2014 the plan is responsive, so absolute coordinates would drift at every breakpoint.';
    displayName: 'Map Point';
    icon: 'pinMap';
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    photo: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    pointId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    verified: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    x: Schema.Attribute.Float & Schema.Attribute.Required;
    y: Schema.Attribute.Float & Schema.Attribute.Required;
  };
}

export interface CampusSafetyGroup extends Struct.ComponentSchema {
  collectionName: 'components_campus_safety_groups';
  info: {
    description: 'One numbered band of the safety page, with its measures.';
    displayName: 'Safety Group';
    icon: 'shield';
  };
  attributes: {
    groupId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    measures: Schema.Attribute.Component<'shared.measure', true>;
    numeral: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 8;
      }>;
    stand: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface ContactField extends Struct.ComponentSchema {
  collectionName: 'components_contact_fields';
  info: {
    description: "The wording of one field on the enquiry form. \u26A0 `key` MATCHES THE INPUT'S id AND IS NOT EDITORIAL \u2014 it is what binds this record to the input, the label's `for`, the autocomplete hint and the validation rule, all of which stay in code. \u26A0 THE LABEL AND ITS ERROR MESSAGE LIVE TOGETHER ON PURPOSE. They were in two places, the markup and the script, and a school that reworded 'Phone number' would have left the error still saying something else.";
    displayName: 'Contact Form Field';
    icon: 'handRock';
  };
  attributes: {
    error: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    key: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    required: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface DisclosureBoardResult extends Struct.ComponentSchema {
  collectionName: 'components_disclosure_board_results';
  info: {
    description: "One year of board results, as the tabs present them. \u26A0 `year` IS THE SCHOOL'S OWN LABEL \u2014 it writes the examination year (2025), not the session (2024-25). Adding a fourth year is one more entry here and no change to the page. \u26A0 NEWEST FIRST: the tabs read the stored order.";
    displayName: 'Board Result Year';
    icon: 'medal';
  };
  attributes: {
    classX: Schema.Attribute.Component<'disclosure.result-row', false>;
    classXii: Schema.Attribute.Component<'disclosure.result-row', false>;
    year: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 16;
      }>;
  };
}

export interface DisclosureResultRow extends Struct.ComponentSchema {
  collectionName: 'components_disclosure_result_rows';
  info: {
    description: "One class's board result for one year. \u26A0 THERE IS NO 'APPEARED' FIELD, DELIBERATELY. The school publishes Registered, Passed and pass percentage only; the reference design showed an Appeared row, and filling it by assuming appeared = registered would be inventing an examination statistic. \u26A0 `percentage` IS A STRING because the school files '98.90' and '100' \u2014 storing a number would print 98.9 and lose a digit the filing has.";
    displayName: 'Board Result Row';
    icon: 'chartCircle';
  };
  attributes: {
    passed: Schema.Attribute.Integer & Schema.Attribute.Required;
    percentage: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 12;
      }>;
    registered: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

export interface DisclosureSection extends Struct.ComponentSchema {
  collectionName: 'components_disclosure_sections';
  info: {
    description: 'One numbered section of the Mandatory Public Disclosure page. \u26A0\u26A0 `anchor` IS A URL TARGET. It is the id the section carries and the href the side rail links to, so changing it breaks any link a parent or an inspector has saved to that section. Change the label freely; change the anchor only deliberately. \u26A0 THE LABEL USED TO BE WRITTEN TWICE \u2014 once for the rail, once as the section heading \u2014 and the two could drift. One record now feeds both. The section number is derived from position, not stored.';
    displayName: 'Disclosure Section';
    icon: 'bulletList';
  };
  attributes: {
    anchor: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface HomeAffiliationMark extends Struct.ComponentSchema {
  collectionName: 'components_home_affiliation_marks';
  info: {
    description: 'One partner or accreditation logo. \u26A0 B1 in docs/07 is still open: written permission to use each third-party mark, and the real Education World logo (the supplied file is generic stock).';
    displayName: 'Affiliation Mark';
    icon: 'shield';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    note: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface HomeEvent extends Struct.ComponentSchema {
  collectionName: 'components_home_events';
  info: {
    description: 'A curated events teaser. \u26A0 NOT derived from News Item: these five carry their own captions and photographs, chosen for the homepage rather than pulled from the chronicles.';
    displayName: 'Homepage Event';
    icon: 'calendar';
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    caption: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    image: Schema.Attribute.Media<'images'>;
    tag: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    when: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
  };
}

export interface HomeFacilityCard extends Struct.ComponentSchema {
  collectionName: 'components_home_facility_cards';
  info: {
    description: 'A homepage campus teaser with its own three-photograph grid. \u26A0 NOT the same as Campus Facility: that collection holds rooms with full galleries for the /campus/ tour; these are short editorial cards with their own wording and a link out. \u26A0 `detail` IS OPTIONAL ON PURPOSE \u2014 the Conference Room has no published description and the panel prints its name and qualifier rather than invented copy (docs/07 B3). \u26A0 `shots` REPLACED A `photo` KEY: the source held a string that indexed a hardcoded gallery in Campus.astro, so changing which photograph the homepage shows meant editing Astro. The photographs and their alt text are editorial and live here; which of the three lands in the tall slot and which two stack beside it is layout and stays in Astro.';
    displayName: 'Facility Card';
    icon: 'house';
  };
  attributes: {
    brief: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    detail: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    href: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    qualifier: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    shots: Schema.Attribute.Component<'shared.photo', true>;
  };
}

export interface HomeSlide extends Struct.ComponentSchema {
  collectionName: 'components_home_slides';
  info: {
    description: 'One photograph in the homepage hero carousel. \u26A0 `focalPoint` AND `tone` LIVE HERE, NOT IN ASTRO, even though both look like styling: they are properties of THIS photograph, not of the layout. The crop that keeps faces in frame is wrong the moment the picture changes, and the placeholder tone is chosen to sit under this image. An editor swapping a slide must be able to bring them with it. \u26A0 `caption` is what the carousel prints under the image; where it is absent the panel falls back to `brief` and marks it as an outstanding asset (docs/07 A2).';
    displayName: 'Hero Slide';
    icon: 'picture';
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    brief: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    caption: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    focalPoint: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 24;
      }> &
      Schema.Attribute.DefaultTo<'50% 50%'>;
    image: Schema.Attribute.Media<'images'>;
    tone: Schema.Attribute.Enumeration<
      ['ink', 'charcoal', 'maroon', 'sand', 'ivory']
    > &
      Schema.Attribute.DefaultTo<'charcoal'>;
  };
}

export interface HomeSportCard extends Struct.ComponentSchema {
  collectionName: 'components_home_sport_cards';
  info: {
    description: "The homepage's sport panel. `indoor`/`outdoor` are the two game lists it prints; `brief` is the outstanding photography request (docs/07 A2), kept because it is an asset the school still owes.";
    displayName: 'Sport Card';
    icon: 'trophy';
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    brief: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    href: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    indoor: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    outdoor: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    photo: Schema.Attribute.Media<'images'>;
    photoAlt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface HomeStage extends Struct.ComponentSchema {
  collectionName: 'components_home_stages';
  info: {
    description: 'One academic stage teaser on the homepage. `imageBrief` describes the photograph still to be commissioned \u2014 kept because it is an outstanding asset request, not decoration. WARNING: photo replaced a key that indexed a hardcoded map in AcademicJourney.astro; three of the five stages still have no Ballia photograph and render the brief instead, which is correct and deliberate.';
    displayName: 'Stage Card';
    icon: 'apps';
  };
  attributes: {
    badge: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    detail: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    href: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    imageBrief: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    photo: Schema.Attribute.Media<'images'>;
    photoAlt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    range: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    years: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
  };
}

export interface HomeStrand extends Struct.ComponentSchema {
  collectionName: 'components_home_strands';
  info: {
    description: 'One non-sport strand on the Beyond Academics band. Only the leadership strand has a photograph so far; the other renders its brief in a labelled placeholder, which is the honest state and what the live site shows.';
    displayName: 'Strand';
    icon: 'apps';
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    brief: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    href: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    photo: Schema.Attribute.Media<'images'>;
    photoAlt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface HomeVoice extends Struct.ComponentSchema {
  collectionName: 'components_home_voices';
  info: {
    description: 'One alumni card on the homepage. \u26A0 NOT shared.point: the source shape is {quote, name, classOf, photo}, and squeezing it into title/body would have made the class year part of a sentence and left nowhere for the photograph \u2014 so an editor could never have added the entry the section is waiting for (docs/07 A4). `photo` is optional; the card falls back to the school monogram, which is a design decision that stays in Astro.';
    displayName: 'Alumni Voice';
    icon: 'quote';
  };
  attributes: {
    classOf: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 16;
      }>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    photo: Schema.Attribute.Media<'images'>;
    quote: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
  };
}

export interface NewsGroup extends Struct.ComponentSchema {
  collectionName: 'components_news_groups';
  info: {
    description: "One band within a chronicle page \u2014 the heading and note above a set of items. `groupId` is what a news-item's `group` field points at; renaming the label does not move any item.";
    displayName: 'News Group';
    icon: 'layer';
  };
  attributes: {
    groupId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    note: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
  };
}

export interface PhilosophyAbility extends Struct.ComponentSchema {
  collectionName: 'components_philosophy_abilities';
  info: {
    description: 'One ability in the constellation on section 03. \u26A0 ITS POSITION ON THE RING IS NOT HERE. The angle is evenly spaced around the circle and computed by the page from how many cards there are \u2014 0\u00B0, 51\u00B0, 103\u00B0 \u2026 for seven. It was stored once, and storing it meant an editor could move a node off the ring, or add an eighth card that overlapped the first.';
    displayName: 'Ability';
    icon: 'star';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
  };
}

export interface PhilosophyClose extends Struct.ComponentSchema {
  collectionName: 'components_philosophy_closes';
  info: {
    description: 'The full-bleed closing band. \u26A0 The scrim, the float ornament and the reveal delays are design and stay in the page.';
    displayName: 'Closing statement';
    icon: 'medium';
  };
  attributes: {
    headingLines: Schema.Attribute.Component<'shared.paragraph', true>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imageAlt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    quote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    quoteAuthor: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface PhilosophyCollage extends Struct.ComponentSchema {
  collectionName: 'components_philosophy_collages';
  info: {
    description: 'A heading over a short index line, two paragraphs, and three photographs arranged as a collage. \u26A0 The collage geometry \u2014 which frame is masked, which pops, the zoom on each \u2014 is design and stays in the page. Only the words and the three photographs are here.';
    displayName: 'Collage section';
    icon: 'picture';
  };
  attributes: {
    body: Schema.Attribute.Component<'shared.paragraph', true>;
    closingLine: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    headingSecond: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    imageOne: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imageOneAlt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    imageThree: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imageThreeAlt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    imageTwo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imageTwoAlt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    index: Schema.Attribute.Component<'shared.paragraph', true>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
  };
}

export interface PhilosophyConstellation extends Struct.ComponentSchema {
  collectionName: 'components_philosophy_constellations';
  info: {
    description: "Section 03 \u2014 the abilities orbiting a central photograph. \u26A0 THE RING ITSELF IS DESIGN: its radius, the two drawn circles and each node's position are computed by the page. Adding or removing a card re-spaces the ring automatically.";
    displayName: 'Constellation section';
    icon: 'bulletList';
  };
  attributes: {
    body: Schema.Attribute.Component<'shared.paragraph', true>;
    cards: Schema.Attribute.Component<'philosophy.ability', true>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    headingEm: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imageAlt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
  };
}

export interface PhilosophyListing extends Struct.ComponentSchema {
  collectionName: 'components_philosophy_listings';
  info: {
    description: 'A statement with a short list under it and photographs alongside. \u26A0 The collage geometry, the sizes, the overlaps and the reveal delays are design and stay in the page.';
    displayName: 'Listing section';
    icon: 'bulletList';
  };
  attributes: {
    body: Schema.Attribute.Component<'shared.paragraph', true>;
    entries: Schema.Attribute.Component<'shared.detail', true>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    headingEm: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    imageOne: Schema.Attribute.Media<'images'>;
    imageOneAlt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    imageThree: Schema.Attribute.Media<'images'>;
    imageThreeAlt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    imageTwo: Schema.Attribute.Media<'images'>;
    imageTwoAlt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
  };
}

export interface PhilosophyMarked extends Struct.ComponentSchema {
  collectionName: 'components_philosophy_marked';
  info: {
    description: 'One word and the symbol drawn beside it. \u26A0 The symbols are drawn by the site, so the list is exactly the ones it can draw \u2014 pick the one that fits the word.';
    displayName: 'Word with a symbol';
    icon: 'bulletList';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    mark: Schema.Attribute.Enumeration<
      [
        'book',
        'hands',
        'clipboard',
        'speech',
        'chart',
        'cup',
        'calendar',
        'doc',
        'pen',
        'desk',
        'flask',
        'sun',
        'clock',
        'hourglass',
        'search',
        'target',
        'bulb',
        'medal',
        'shield',
        'bell',
        'handHeart',
        'eye',
        'person',
        'head',
        'grow',
        'quote',
        'arrow',
        'download',
        'external',
        'chat',
        'atom',
        'present',
        'layers',
        'refresh',
        'hand',
        'megaphone',
        'ribbon',
        'bookmark',
        'globe',
        'cap',
        'pin',
        'seat',
        'spark',
        'route',
        'leaf',
        'scroll',
        'phone',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'bulb'>;
  };
}

export interface PhilosophyMarkedList extends Struct.ComponentSchema {
  collectionName: 'components_philosophy_marked_lists';
  info: {
    description: 'Copy with a run of single words beside it, each carrying a small symbol, and one or two photographs. \u26A0 The numbering, the run direction, the reveal delays and the frame geometry are design and stay in the page.';
    displayName: 'Marked-list section';
    icon: 'bulletList';
  };
  attributes: {
    body: Schema.Attribute.Component<'shared.paragraph', true>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    headingEm: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    headingSecond: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    imageOne: Schema.Attribute.Media<'images'>;
    imageOneAlt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    imageTwo: Schema.Attribute.Media<'images'>;
    imageTwoAlt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    marks: Schema.Attribute.Component<'philosophy.marked', true>;
  };
}

export interface PhilosophyPair extends Struct.ComponentSchema {
  collectionName: 'components_philosophy_pairs';
  info: {
    description: 'Section 02 \u2014 the same copy as a statement section, but with two photographs set on a diagonal with a drawn connector between them. \u26A0 The diagonal, the connector and the parallax are design and stay in the page; only the two photographs and their descriptions are here.';
    displayName: 'Two-photograph section';
    icon: 'picture';
  };
  attributes: {
    body: Schema.Attribute.Component<'shared.paragraph', true>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    headingEm: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    imageLower: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imageLowerAlt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    imageUpper: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imageUpperAlt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    quote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    quoteAuthor: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface PhilosophyStatement extends Struct.ComponentSchema {
  collectionName: 'components_philosophy_statements';
  info: {
    description: "One of the page's statement sections \u2014 a small label, a heading, an optional quotation and one or more paragraphs beside a photograph. \u26A0 WHAT IS NOT HERE: the section's number, its washes and grids, its float ornaments, the reveal delays and the order it appears in. Those are the design and stay in the page.";
    displayName: 'Statement section';
    icon: 'quote';
  };
  attributes: {
    body: Schema.Attribute.Component<'shared.paragraph', true>;
    caption: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    captionSecond: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    headingEm: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imageAlt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    quote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    quoteAuthor: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface PhilosophyStep extends Struct.ComponentSchema {
  collectionName: 'components_philosophy_steps';
  info: {
    description: 'One move in a sequence \u2014 a name, a sentence, a photograph and a small mark. \u26A0 Its position in the run and the delay it animates on are design: the page spaces them and staggers them from how many there are.';
    displayName: 'Step';
    icon: 'arrowRight';
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    icon: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    photo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    photoAlt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface PhilosophySteps extends Struct.ComponentSchema {
  collectionName: 'components_philosophy_step_sections';
  info: {
    description: 'A heading made of the step names in sequence, over the steps themselves. \u26A0 THE ARROWS BETWEEN THE WORDS ARE DRAWN BY THE PAGE, and so is the italic on the last one \u2014 type the words, the design joins them up.';
    displayName: 'Steps section';
    icon: 'bulletList';
  };
  attributes: {
    headingWords: Schema.Attribute.Component<'shared.paragraph', true>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    steps: Schema.Attribute.Component<'philosophy.step', true>;
  };
}

export interface PublicationsMyraPage extends Struct.ComponentSchema {
  collectionName: 'components_publications_myra_pages';
  info: {
    description: 'One page of the MYRA STEM Lab newsletter \u2014 the scan, and what it shows. \u26A0 THE ORDER OF THESE ROWS IS THE ORDER ON THE PAGE, and the rail numbers itself from it ("page 3 of 5"), so dragging a row renumbers the caption too. \u26A0 `alt` IS NOT OPTIONAL AND IS NOT THE TITLE. It describes what is ON the scan for a reader who cannot see it. The school\u2019s own widget ships all five with empty alt; these were written for this site and should stay written.';
    displayName: 'MYRA Page';
    icon: 'file';
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface SharedAddress extends Struct.ComponentSchema {
  collectionName: 'components_shared_addresses';
  info: {
    description: "The school's postal address. Field names mirror data/site.ts exactly so the 57 files reading school.address.city need no change beyond their import.";
    displayName: 'Address';
    icon: 'pinMap';
  };
  attributes: {
    city: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    country: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    landmark: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    line1: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    pin: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 12;
      }>;
    state: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
  };
}

export interface SharedAffiliation extends Struct.ComponentSchema {
  collectionName: 'components_shared_affiliations';
  info: {
    description: 'CBSE affiliation particulars. These are regulatory identifiers printed on the Mandatory Public Disclosure page and quoted across the site; the affiliation period expires 31.03.2030 and must be editable without a deploy.';
    displayName: 'Affiliation';
    icon: 'shield';
  };
  attributes: {
    affiliationLetterDated: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    affiliationLetterNo: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    affiliationNo: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
    affiliationPeriod: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    affiliationSubject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    board: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    boardFull: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    schoolCode: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
    udise: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
  };
}

export interface SharedContact extends Struct.ComponentSchema {
  collectionName: 'components_shared_contacts';
  info: {
    description: 'Phone numbers and email addresses. NAMED FIELDS, NOT A REPEATABLE LIST \u2014 every consumer reads school.phone.officeDisplay by name, and a list would turn 57 one-line import swaps into 57 lookup rewrites. Each number is stored twice on purpose: the dial value has no spaces for tel: hrefs, the display value is what a reader sees.';
    displayName: 'Contact';
    icon: 'phone';
  };
  attributes: {
    admissions: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 24;
      }>;
    admissionsDisplay: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
    email: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    office: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 24;
      }>;
    officeDisplay: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
    recruitmentEmail: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    transport: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 24;
      }>;
    transportDisplay: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
    transportIncharge: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface SharedDetail extends Struct.ComponentSchema {
  collectionName: 'components_shared_details';
  info: {
    description: "A labelled value, optionally linked and optionally qualified. The most repeated shape in the regulatory and catalogue pages: the disclosure quick card, the CBSE general-information table, the staff summary, the infrastructure figures and the uniform seasons are all this and nothing more. \u26A0 `note` CARRIES THE PROVENANCE on the disclosure table \u2014 'affiliation letter', 'school letterhead' \u2014 which is why it exists as a field rather than being folded into the value: a reader must be able to tell which rows are Appendix IX and which are not. WARNING: links EXISTS FOR THE SYLLABUS DOCUMENTS. A curriculum stage carries a list of per-class syllabus PDFs - real, published documents a parent downloads. Held as a flat row they had nowhere to go and disappeared, which no count of rows would have shown. slot is the stable key a bespoke layout binds a row to. WARNING: links EXISTS FOR THE SYLLABUS DOCUMENTS. A curriculum stage carries a list of per-class syllabus PDFs - real, published documents a parent downloads. Held as a flat row they had nowhere to go and disappeared, which no count of rows would have shown. slot is the stable key a bespoke layout binds a row to.";
    displayName: 'Detail';
    icon: 'bulletList';
  };
  attributes: {
    href: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    links: Schema.Attribute.Component<'shared.link', true>;
    note: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    slot: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    value: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
  };
}

export interface SharedDocument extends Struct.ComponentSchema {
  collectionName: 'components_shared_documents';
  info: {
    description: "One downloadable document card \u2014 the eight certificates and the five academic filings on the disclosure page. \u26A0 `file` WINS OVER `href`. Today every one of these points at a PDF on the school's own WordPress domain, which is where it publishes them; `file` exists so a refiled certificate can simply be uploaded into Strapi instead, without a developer. These documents are refiled annually, so that route needs to exist before it is needed.";
    displayName: 'Document';
    icon: 'file';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    file: Schema.Attribute.Media<'files' | 'images'>;
    href: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    key: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 16;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface SharedExternalLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_external_links';
  info: {
    description: 'Destinations the school owns but this site does not: the vendor ERP and the old WordPress. Named fields rather than a list because each has a distinct job \u2014 see the notes in data/site.ts on why applyNurseryToIX and applyFormNurseryToIX are deliberately different URLs.';
    displayName: 'External Links';
    icon: 'cursor';
  };
  attributes: {
    affiliationLetter: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    applyClassXI: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    applyFormClassXI: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    applyFormNurseryToIX: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    applyNurseryToIX: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    downloadTC: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    mandatoryDisclosure: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    parentLogin: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    resultPage: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    results: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface SharedFact extends Struct.ComponentSchema {
  collectionName: 'components_shared_facts';
  info: {
    description: "One itemised proof line, read off the source artwork. Repeatable. \u26A0 2000 CHARACTERS, AND A text FIELD. It began as a one-line proof read off artwork, but the academics pages use the same shape for lists of full sentences \u2014 a stream's rationale, a policy's clauses. A 200-character string field truncated them, and the seed refused rather than storing half a sentence.";
    displayName: 'Fact';
    icon: 'check';
  };
  attributes: {
    value: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }>;
  };
}

export interface SharedFigure extends Struct.ComponentSchema {
  collectionName: 'components_shared_figures';
  info: {
    description: "A headline value with its label. \u26A0 DISTINCT FROM shared.stat, which counts: stat.count is an integer the odometer tweens. These figures are strings \u2014 'I\u2013XII', 'A & B', '15' \u2014 because several are ranges or labels, not numbers, and forcing them into an integer would lose them.";
    displayName: 'Figure';
    icon: 'hashtag';
  };
  attributes: {
    figure: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 24;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    note: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    description: "A labelled destination. Used for quick-access tiles and breadcrumbs. `external` drives target/rel on the anchor rather than being inferred from the href, because several internal links point at the school's own other domain.";
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    external: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    href: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface SharedMeasure extends Struct.ComponentSchema {
  collectionName: 'components_shared_measures';
  info: {
    description: 'A stated safety or provision measure. `verified` records whether the school has published it \u2014 the site renders unverified items differently rather than dropping them, so the flag is content, not a build artefact.';
    displayName: 'Measure';
    icon: 'shield';
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    verified: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
  };
}

export interface SharedParagraph extends Struct.ComponentSchema {
  collectionName: 'components_shared_paragraphs';
  info: {
    description: 'One paragraph of body copy. Used where the source data is string[] and the component renders each entry as its own <p> \u2014 a rich-text field would merge them and lose that structure.';
    displayName: 'Paragraph';
    icon: 'align-left';
  };
  attributes: {
    text: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }>;
  };
}

export interface SharedPhoto extends Struct.ComponentSchema {
  collectionName: 'components_shared_photos';
  info: {
    description: 'One captioned photograph. The single most repeated structure in this project \u2014 alumni meet galleries, calendar sheets, excursion sections and event chronicles all use it.';
    displayName: 'Photo';
    icon: 'picture';
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    caption: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    key: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface SharedPoint extends Struct.ComponentSchema {
  collectionName: 'components_shared_points';
  info: {
    description: "A numbered explanatory card \u2014 marker, heading, body. Recurs across services help strips, campus emergency steps, facilities rationale cards and parent-forum benefits. \u26A0 `href` AND AN OPTIONAL `body` WERE ADDED FOR ACADEMICS. Sixty-odd arrays across the academics pages are {n, mark, k, v} \u2014 this component exactly \u2014 and a handful carry a link or a bare label with no body. Widening the component was right where minting a near-identical second one would have left two things to keep in step. \u26A0 `number` IS 60 CHARACTERS, NOT 8. It started as a marker like '01', but the academics pages use the same slot for a phase name, a session year and a cycle step \u2014 'Taught content' is a number in this sense. Truncating it would have silently shortened the label on several pages. \u26A0\u26A0 A POINT CAN CARRY ITS OWN PHOTOGRAPH. Several academics arrays are a label, a body AND an image in one entry \u2014 `stops` is {n, k, body, photo, alt, owed}. Routing those to a photo list kept the picture and silently dropped the prose beside it; splitting them into two lists would have broken the markup that reads one array. `owed` is the source's own flag for an asset the school still has to supply: the page renders a labelled placeholder rather than pretending. \u26A0 `slot` IS A STABLE IDENTIFIER, NOT EDITORIAL. A few academics arrays bind a card to a position in a bespoke layout \u2014 ParentOrientation's frames are 'a', 'b', 'c', 'd' \u2014 and the markup finds a card by that key. Without somewhere to keep it the key was dropped, which no count check can see: the right number of cards arrived and the page could no longer tell which was which. \u26A0 `note` AND `tags` CARRY THE SECOND LINE AND THE CHIP ROW. The academics cards routinely have more than a heading and a paragraph: an assessment step has a `gloss`, a programme card a `sub`, a workshop card a `format` line and a row of names. A field-fidelity check found 117 such values with nowhere to land \u2014 invisible to a build, invisible to a count of cards, and visible only as a page quietly saying less than it used to. WARNING: flag CARRIES THE SOURCE'S OWN BOOLEAN STATE - a subject whose post the school has advertised as filled. It is content, not styling: the page prints a different qualifier for it. WARNING: flag CARRIES THE SOURCE'S OWN BOOLEAN STATE - a subject whose post the school has advertised as filled. It is content, not styling: the page prints a different qualifier for it. WARNING: suffix, anchor AND quote WERE EACH FOUND BY THE FIELD-FIDELITY CHECK. A smart-classroom figure reads '75+' and the plus was being dropped; a methodology card carries an anchor line naming the evidence behind it; a stage card carries a quotation. None of the three changes the number of cards on the page, so nothing but a field-level comparison would have noticed them go. WARNING: children IS A CARD'S NESTED LIST OF ROWS, not of strings. The laboratory index groups its rooms as { label, items: [{ name, glyph }] }; tags holds strings only, so those rooms had nowhere to go and a page of twelve laboratories rendered its two group headings and nothing under them.";
    displayName: 'Point';
    icon: 'bulletList';
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    anchor: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    body: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    caption: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    children: Schema.Attribute.Component<'shared.detail', true>;
    flag: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    href: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    image: Schema.Attribute.Media<'images'>;
    note: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    number: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    owed: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    quote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    slot: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    suffix: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 8;
      }>;
    tags: Schema.Attribute.Component<'shared.fact', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface SharedSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_sections';
  info: {
    description: "One KEYED block of editorial content on an academics page. \u26A0\u26A0 THE KEY IS THE CONTRACT. The page looks its content up by key \u2014 `section('steps').points` \u2014 so the Astro file keeps its own bespoke layout, its GSAP timeline, its scoped CSS and its markup, and only the SOURCE of the words changes. Renaming a key silently empties whatever it fed, which is why the seed and the page must be changed together. \u26A0 EVERY PART IS OPTIONAL AND MOST SECTIONS USE TWO OR THREE. The academics pages are forty bespoke designs; this is the union of the shapes they actually hold, not a template any of them fills in. \u26A0 WHAT IS *NOT* HERE: tile positions, orbit radii, animation delays, tone/accent palettes and glyph geometry. Those are design, they stay in the component, and a page that needs one keys it off the content rather than storing it.";
    displayName: 'Section';
    icon: 'layer';
  };
  attributes: {
    awards: Schema.Attribute.Component<'academics.award', true>;
    body: Schema.Attribute.Component<'shared.paragraph', true>;
    details: Schema.Attribute.Component<'shared.detail', true>;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    facts: Schema.Attribute.Component<'shared.fact', true>;
    faqs: Schema.Attribute.Component<'academics.faq', true>;
    figures: Schema.Attribute.Component<'shared.figure', true>;
    heading: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    key: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    links: Schema.Attribute.Component<'shared.link', true>;
    note: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    photos: Schema.Attribute.Component<'shared.photo', true>;
    points: Schema.Attribute.Component<'shared.point', true>;
    results: Schema.Attribute.Component<'academics.result', true>;
    standfirst: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    stats: Schema.Attribute.Component<'shared.stat', true>;
    stories: Schema.Attribute.Component<'academics.story', true>;
    streams: Schema.Attribute.Component<'academics.stream', true>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Page metadata. Attached to Single Types as they are migrated. Route-level SEO for collection-driven pages still lives in the .astro file and moves with the pages architecture, which is deliberately not started yet.';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    noIndex: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    ogImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSocial extends Struct.ComponentSchema {
  collectionName: 'components_shared_socials';
  info: {
    description: 'Social profiles. Empty means the channel is not linked \u2014 audit 14.3 says not to ship links to dormant channels, so youtube and x are present but blank until the school confirms they are maintained.';
    displayName: 'Social';
    icon: 'earth';
  };
  attributes: {
    facebook: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    instagram: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    linkedin: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    x: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    youtube: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface SharedStat extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats';
  info: {
    description: "A counted figure with its label. Recurs in facilities KPIs, campus tour overview, sports figures and site counters \u2014 count and suffix are separate so the odometer animation can tween the number and hold the '+'.";
    displayName: 'Stat';
    icon: 'chartBubble';
  };
  attributes: {
    count: Schema.Attribute.Integer & Schema.Attribute.Required;
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    note: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    suffix: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 8;
      }> &
      Schema.Attribute.DefaultTo<''>;
  };
}

export interface SportsCoachCard extends Struct.ComponentSchema {
  collectionName: 'components_sports_coach_cards';
  info: {
    description: 'One claim about coaching, with the evidence for it. `proof` is what the school published to support the claim \u2014 the card prints it rather than asserting alone.';
    displayName: 'Coach Card';
    icon: 'user';
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    figure: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 24;
      }>;
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    proof: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface SportsPodium extends Struct.ComponentSchema {
  collectionName: 'components_sports_podiums';
  info: {
    description: 'One event and the placings the school reported for it.';
    displayName: 'Podium';
    icon: 'trophy';
  };
  attributes: {
    event: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    places: Schema.Attribute.Component<'shared.fact', true>;
  };
}

export interface SportsRung extends Struct.ComponentSchema {
  collectionName: 'components_sports_rungs';
  info: {
    description: 'One step of the participation ladder. `accent` is one of four palette slots the band cycles; `pending` marks a rung the school has described but not evidenced.';
    displayName: 'Ladder Rung';
    icon: 'chartBubble';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<['teal', 'violet', 'maroon', 'deep']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'teal'>;
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1200;
      }>;
    glyph: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    items: Schema.Attribute.Component<'shared.fact', true>;
    milestone: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    pending: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    step: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 16;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface StructureCell extends Struct.ComponentSchema {
  collectionName: 'components_structure_cells';
  info: {
    description: 'One item in a run \u2014 a name, a line under it, and a symbol. \u26A0 THE 01, 02, 03 IS COUNTED BY THE PAGE. Every numbered run on these pages was a plain sequence, so the number is not stored: add or remove a cell and the run renumbers itself.';
    displayName: 'Cell';
    icon: 'bulletList';
  };
  attributes: {
    alt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    caption: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    flag: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    href: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    image: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    mark: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    note: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    number: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    state: Schema.Attribute.Enumeration<['yes', 'part', 'info']>;
    sub: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    suffix: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 8;
      }>;
    value: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
  };
}

export interface StructureSection extends Struct.ComponentSchema {
  collectionName: 'components_structure_sections';
  info: {
    description: 'One band of the page: the small label, the heading, the paragraphs, the photographs and the run of cells. \u26A0 EVERY SECTION ON THESE PAGES IS THIS SHAPE \u2014 what differs between them is how the page LAYS IT OUT, and that stays in the page. You cannot reorder, add or remove sections; you fill in the ones that are there.';
    displayName: 'Section';
    icon: 'layout';
  };
  attributes: {
    body: Schema.Attribute.Component<'shared.paragraph', true>;
    caption: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    cells: Schema.Attribute.Component<'structure.cell', true>;
    cellsTwo: Schema.Attribute.Component<'structure.cell', true>;
    heading: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    shots: Schema.Attribute.Component<'shared.photo', true>;
  };
}

export interface StructureStream extends Struct.ComponentSchema {
  collectionName: 'components_structure_streams';
  info: {
    description: "One stream after Class X, and the subjects in it. \u26A0 EDITED ONCE, DRAWN SEVERAL TIMES \u2014 the same four streams carry the cards, the rail and the subject map on their page. Change one here and every place it appears changes with it. The 01\u201304 and the colour are the page's.";
    displayName: 'Stream';
    icon: 'layer';
  };
  attributes: {
    additional: Schema.Attribute.Component<'shared.paragraph', true>;
    core: Schema.Attribute.Component<'shared.paragraph', true>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    mark: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    note: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    optional: Schema.Attribute.Component<'shared.paragraph', true>;
    owed: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    sub: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    value: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
  };
}

export interface UniformCatalogue extends Struct.ComponentSchema {
  collectionName: 'components_uniform_catalogues';
  info: {
    description: "One published uniform catalogue. \u26A0 `file` IS THE CATALOGUE ITSELF, now held in Strapi media rather than as a path into the site's public directory \u2014 a new edition is an upload, not a deploy. `originHref` records where the school publishes the same document, which is provenance and stays a plain URL because it is not ours to host. \u26A0 `pages` AND `size` DESCRIBE THE FILE and are stated on the card; they are transcribed rather than computed because the card quotes the document, not the upload.";
    displayName: 'Uniform Catalogue';
    icon: 'book';
  };
  attributes: {
    file: Schema.Attribute.Media<'files' | 'images'>;
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    linkedAs: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    number: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 8;
      }>;
    originHref: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    pages: Schema.Attribute.Integer;
    revised: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    session: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    size: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 24;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface UniformShoeRow extends Struct.ComponentSchema {
  collectionName: 'components_uniform_shoe_rows';
  info: {
    description: "One row of the catalogue's footwear table, transcribed cell for cell. Boys and girls are separate columns in the document, so they are separate fields here rather than one merged description.";
    displayName: 'Shoe Table Row';
    icon: 'apps';
  };
  attributes: {
    boys: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    classes: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    days: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    girls: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface UniformedGroup extends Struct.ComponentSchema {
  collectionName: 'components_uniformed_groups';
  info: {
    description: 'One uniformed group on Beyond Academics \u2192 NCC, Scouts & Guides. \u26A0 `slug` IS THE PAGE ANCHOR (#ncc, #scouts-guides) and may be linked from outside the site \u2014 rename the group freely, but change the slug only if you mean to break those links. \u26A0\u26A0 EVERY FACT ON THIS PAGE HAS A SOURCE, and `verified` on each fact is what says whether it is the school describing itself or something independently evidenced. A claim about OTHER schools \u2014 "first in the district", "first of its kind" \u2014 must stay unverified so the page keeps attributing it.';
    displayName: 'Uniformed Group';
    icon: 'shield';
  };
  attributes: {
    blurb: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    facts: Schema.Attribute.Component<'shared.measure', true>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    pending: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    photos: Schema.Attribute.Component<'shared.photo', true>;
    record: Schema.Attribute.Component<'shared.point', true>;
    slug: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'about.testimonial': AboutTestimonial;
      'academics.award': AcademicsAward;
      'academics.class-doc': AcademicsClassDoc;
      'academics.faq': AcademicsFaq;
      'academics.lede': AcademicsLede;
      'academics.result': AcademicsResult;
      'academics.stage': AcademicsStage;
      'academics.story': AcademicsStory;
      'academics.stream': AcademicsStream;
      'academics.tile': AcademicsTile;
      'academics.tiles': AcademicsTiles;
      'achievements.record-board': AchievementsRecordBoard;
      'campus.facility-group': CampusFacilityGroup;
      'campus.facility-item': CampusFacilityItem;
      'campus.map-point': CampusMapPoint;
      'campus.safety-group': CampusSafetyGroup;
      'contact.field': ContactField;
      'disclosure.board-result': DisclosureBoardResult;
      'disclosure.result-row': DisclosureResultRow;
      'disclosure.section': DisclosureSection;
      'home.affiliation-mark': HomeAffiliationMark;
      'home.event': HomeEvent;
      'home.facility-card': HomeFacilityCard;
      'home.slide': HomeSlide;
      'home.sport-card': HomeSportCard;
      'home.stage': HomeStage;
      'home.strand': HomeStrand;
      'home.voice': HomeVoice;
      'news.group': NewsGroup;
      'philosophy.ability': PhilosophyAbility;
      'philosophy.close': PhilosophyClose;
      'philosophy.collage': PhilosophyCollage;
      'philosophy.constellation': PhilosophyConstellation;
      'philosophy.listing': PhilosophyListing;
      'philosophy.marked': PhilosophyMarked;
      'philosophy.marked-list': PhilosophyMarkedList;
      'philosophy.pair': PhilosophyPair;
      'philosophy.statement': PhilosophyStatement;
      'philosophy.step': PhilosophyStep;
      'philosophy.steps': PhilosophySteps;
      'publications.myra-page': PublicationsMyraPage;
      'shared.address': SharedAddress;
      'shared.affiliation': SharedAffiliation;
      'shared.contact': SharedContact;
      'shared.detail': SharedDetail;
      'shared.document': SharedDocument;
      'shared.external-links': SharedExternalLinks;
      'shared.fact': SharedFact;
      'shared.figure': SharedFigure;
      'shared.link': SharedLink;
      'shared.measure': SharedMeasure;
      'shared.paragraph': SharedParagraph;
      'shared.photo': SharedPhoto;
      'shared.point': SharedPoint;
      'shared.section': SharedSection;
      'shared.seo': SharedSeo;
      'shared.social': SharedSocial;
      'shared.stat': SharedStat;
      'sports.coach-card': SportsCoachCard;
      'sports.podium': SportsPodium;
      'sports.rung': SportsRung;
      'structure.cell': StructureCell;
      'structure.section': StructureSection;
      'structure.stream': StructureStream;
      'uniform.catalogue': UniformCatalogue;
      'uniform.shoe-row': UniformShoeRow;
      'uniformed.group': UniformedGroup;
    }
  }
}
