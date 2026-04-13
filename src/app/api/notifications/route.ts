import { NextResponse } from 'next/server';

type NotificationType = 'warning' | 'success' | 'info';

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  read: boolean;
};

const defaultNotifications: NotificationItem[] = [
  {
    id: 1,
    title: 'Sortie Moyekro',
    message: 'Dans 12 jours',
    type: 'warning',
    time: 'Il y a 2h',
    read: false,
  },
  {
    id: 2,
    title: 'Nouvelle activité',
    message: 'Conférence mariage ajoutée',
    type: 'info',
    time: 'Il y a 5h',
    read: false,
  },
  {
    id: 3,
    title: 'Rappel envoyé',
    message: 'Message WhatsApp J-7',
    type: 'success',
    time: 'Hier',
    read: true,
  },
];

const globalForNotifications = globalThis as unknown as {
  notificationsStore?: NotificationItem[];
};

const notificationsStore =
  globalForNotifications.notificationsStore ?? defaultNotifications.map((item) => ({ ...item }));

if (!globalForNotifications.notificationsStore) {
  globalForNotifications.notificationsStore = notificationsStore;
}

export async function GET() {
  try {
    return NextResponse.json(notificationsStore);
  } catch {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: number; markAll?: boolean };

    if (body.markAll) {
      notificationsStore.forEach((notification) => {
        notification.read = true;
      });
      return NextResponse.json({ success: true, notifications: notificationsStore });
    }

    if (typeof body.id !== 'number') {
      return NextResponse.json({ error: 'id invalide' }, { status: 400 });
    }

    const notification = notificationsStore.find((item) => item.id === body.id);
    if (!notification) {
      return NextResponse.json({ error: 'Notification introuvable' }, { status: 404 });
    }

    notification.read = true;
    return NextResponse.json({ success: true, notification });
  } catch {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as { id?: number };

    if (typeof body.id !== 'number') {
      return NextResponse.json({ error: 'id invalide' }, { status: 400 });
    }

    const index = notificationsStore.findIndex((item) => item.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Notification introuvable' }, { status: 404 });
    }

    const [deleted] = notificationsStore.splice(index, 1);
    return NextResponse.json({ success: true, deleted });
  } catch {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}

